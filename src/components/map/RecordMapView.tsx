import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useCallback, useRef, useState } from 'react'
import { View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'

import { useLocation } from '@/hooks/useLocation'
import { useNavigateWithPermissionCheck } from '@/hooks/useNavigationPermissionCheck'
import map from '@/services/map'
import { useMapRecord } from '@/services/record'

import { WebViewBridge, WebView, type WebViewEl } from '../common'
import { MapFAB } from './MapFAB'
import { RefreshButton } from './RefreshButton'
import { RecordFAB } from '../record/RecordFAB'

import type { RootStackParamList } from '@/types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'

export const RecordMapView = () => {
  const webViewRef = useRef<WebViewEl>(null)
  const webViewBridge = useRef(new WebViewBridge(webViewRef)).current

  const { location, refreshLocation } = useLocation()
  const [currentLocation, setCurrentLocation] = useState(location)
  const [mapCenter, setMapCenter] = useState(location)
  const [queryCenter, setQueryCenter] = useState(location)
  const [zoomLevel, setZoomLevel] = useState('LEVEL_3')
  const [queryZoomLevel, setQueryZoomLevel] = useState('LEVEL_3')

  const [isChangedMap, setIsChangedMap] = useState(false)
  const [isMyLocationActive, setIsMyLocationActive] = useState(false)

  const isFABExpanded = useSharedValue(true)
  const bottomTabBarHeight = useBottomTabBarHeight()

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const { navigateWithPermissionCheck } = useNavigateWithPermissionCheck()
  const { data: recordData } = useMapRecord(queryCenter.lat, queryCenter.lng, queryZoomLevel)

  useEffect(() => {
    webViewBridge.onEvent('ZOOM_CHANGE', data => {
      if (data.zoomLevel) {
        setZoomLevel(data.zoomLevel)
        setIsChangedMap(true)
        isFABExpanded.value = false
      }
    })

    webViewBridge.onEvent('POSITION_CHANGE', data => {
      if (data.lat && data.lng) {
        setMapCenter({ lat: data.lat, lng: data.lng })
        setIsChangedMap(true)
        isFABExpanded.value = false
      }
    })

    webViewBridge.onEvent('OVERLAY_CLICK', data => {
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

    return () => {
      webViewBridge.offEvent('OVERLAY_CLICK')
      webViewBridge.offEvent('POSITION_CHANGE')
      webViewBridge.offEvent('ZOOM_CHANGE')
    }
  }, [])

  // WebView로 데이터를 전송하는 함수
  const updateOverlays = useCallback(async () => {
    if (!recordData) return

    const data = recordData.map(r => ({
      id: r.id.toString(),
      category: 'RECORD',
      lat: r.lat,
      lng: r.lng,
      src: r.imageUrl,
    }))

    try {
      await webViewBridge.sendRequest('GET_RECORD_DATA', data)
    } catch (error) {
      console.error('[ERROR] 오버레이 업데이트 실패:', error)
    }
  }, [recordData])

  useEffect(() => {
    void updateOverlays()
  }, [updateOverlays])

  useEffect(() => {
    // 지도 중심이 변경될 때마다 현재 위치와 비교
    const isSameLocation =
      Math.abs(mapCenter.lat - currentLocation.lat) < 0.0001 &&
      Math.abs(mapCenter.lng - currentLocation.lng) < 0.0001

    console.log('isSameLocation', isSameLocation)

    setIsMyLocationActive(isSameLocation)
  }, [mapCenter, currentLocation])

  const handleLocationPress = async () => {
    const coords = await refreshLocation()
    if (coords) {
      try {
        const response = await webViewBridge.sendRequest('GET_CURRENT_LOCATION', coords)
        setCurrentLocation(response.payload)
        setIsMyLocationActive(true)
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

  const handleRefresh = () => {
    setQueryCenter(mapCenter)
    setQueryZoomLevel(zoomLevel)
    setIsChangedMap(false)
  }

  console.log('활성화', isMyLocationActive)

  return (
    <>
      {/* 현재 위치에서 재검색 버튼 */}
      {isChangedMap && (
        <View className="flex-row items-center justify-center">
          <View className="absolute top-3 z-[2]">
            <RefreshButton onPress={handleRefresh} />
          </View>
        </View>
      )}
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
            const map = createMap(${JSON.stringify(location)})
          })
        `}
        onMessage={webViewBridge.handleMessage}
        javaScriptEnabled
        domStorageEnabled
        debug={true}
      />
    </>
  )
}
