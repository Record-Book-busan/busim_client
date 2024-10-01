import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useCallback, useRef, useState } from 'react'
import { View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { useDebounce } from 'use-debounce'

import { useLocation } from '@/hooks/useLocation'
import { useNavigateWithPermissionCheck } from '@/hooks/useNavigationPermissionCheck'
import map from '@/services/map'
import { useMapRecord } from '@/services/record'

import { WebView, type WebViewHandles } from '../common'
import { MapFAB } from './MapFAB'
import { RecordFAB } from '../record/RecordFAB'

import type { RootStackParamList } from '@/types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'

export const RecordMapView = () => {
  const webViewRef = useRef<WebViewHandles>(null)

  const [isMapLoaded, setIsMapLoaded] = useState(false) // 카카오맵 로드 상태

  const { location, refreshLocation } = useLocation()
  const [mapCenter, setMapCenter] = useState(location)
  const [zoomLevel, setZoomLevel] = useState('LEVEL_3')
  const [geolocation] = useDebounce(
    { lat: mapCenter.lat, lng: mapCenter.lng, level: zoomLevel },
    500,
  )

  const [isMyLocationActive, setIsMyLocationActive] = useState(false)

  const isFABExpanded = useSharedValue(true)
  const bottomTabBarHeight = useBottomTabBarHeight()

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const { navigateWithPermissionCheck } = useNavigateWithPermissionCheck()
  const { data: recordData } = useMapRecord(geolocation)

  useEffect(() => {
    const bridge = webViewRef.current?.bridge

    bridge?.onEvent('ZOOM_CHANGE', data => {
      if (data.zoomLevel) {
        setZoomLevel(data.zoomLevel)
        isFABExpanded.value = false
      }
    })

    bridge?.onEvent('CENTER_CHANGE', data => {
      if (data.lat && data.lng) {
        setMapCenter(data)
        isFABExpanded.value = false
      }
    })

    bridge?.onEvent('OVERLAY_CLICK', data => {
      if (data.id) {
        navigateWithPermissionCheck({
          navigation,
          routeName: 'MainTab',
          params: {
            screen: 'Record',
            params: {
              screen: 'ReadRecord',
              params: { id: data.id },
            },
          },
        })
      }
    })

    bridge?.onEvent('CONTENTS_LOADED', data => {
      if (data.loaded) {
        console.log(data.loaded)
        setIsMapLoaded(true)
      }
    })

    return () => {
      bridge?.offEvent('OVERLAY_CLICK')
      bridge?.offEvent('CENTER_CHANGE')
      bridge?.offEvent('ZOOM_CHANGE')
      bridge?.offEvent('CONTENTS_LOADED')
    }
  }, [])

  // WebView로 데이터를 전송하는 함수
  const updateOverlays = useCallback(async () => {
    const bridge = webViewRef.current?.bridge
    if (!bridge || !recordData || !isMapLoaded) return

    const data = recordData.map(r => ({
      id: r.id.toString(),
      category: 'RECORD',
      lat: r.lat,
      lng: r.lng,
      imageUrl: r.imageUrl,
    }))

    try {
      await bridge?.sendRequest('GET_RECORD_DATA', data)
    } catch (error) {
      console.error('[ERROR] 오버레이 업데이트 실패:', error)
    }
  }, [recordData])

  useEffect(() => {
    if (isMapLoaded) {
      void updateOverlays()
    }
  }, [updateOverlays, isMapLoaded])

  useEffect(() => {
    // 지도 중심이 변경될 때마다 현재 위치와 비교
    const isSameLocation =
      Math.abs(mapCenter.lat - location.lat) < 0.0001 &&
      Math.abs(mapCenter.lng - location.lng) < 0.0001

    setIsMyLocationActive(isSameLocation)
  }, [mapCenter])

  const handleLocationPress = async () => {
    if (!isMapLoaded) return

    const latlng = await refreshLocation()
    if (latlng) {
      try {
        await webViewRef.current?.bridge.sendRequest('GET_CURRENT_LOCATION', {
          lat: latlng.lat,
          lng: latlng.lng,
          visible: false,
        })
      } catch (error) {
        console.error('[ERROR] 현재 위치 전송 실패:', error)
      }
    }
  }

  const handleFABPress = () => {
    navigateWithPermissionCheck({
      navigation,
      routeName: 'CreateRecordStack',
      params: {
        screen: 'CreateRecord',
      },
    })
  }

  return (
    <>
      {/* 기록 작성 버튼 */}
      <View
        className="absolute bottom-4 left-4 z-[2]"
        style={{
          paddingBottom: bottomTabBarHeight,
        }}
      >
        <RecordFAB isExpanded={isFABExpanded} onPress={handleFABPress} />
      </View>
      {/* 내 위치 버튼 */}
      <View
        className="absolute bottom-4 right-4 z-[2]"
        style={{
          paddingBottom: bottomTabBarHeight,
        }}
      >
        <MapFAB onPress={handleLocationPress} iconName="position" enabled={isMyLocationActive} />
      </View>
      {/* 지도 웹뷰 */}
      <WebView
        ref={webViewRef}
        source={{ html: map }}
        injectedJavaScript={`
          kakao.maps.load(function(){
            createMap(${JSON.stringify(location)});
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'CONTENTS_LOADED',
              data: { loaded: true }
            }));
          });
        `}
        javaScriptEnabled
        domStorageEnabled
        debug={true}
      />
    </>
  )
}
