import { type BottomTabNavigationProp, useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useEffect, useCallback, useRef, useState, useMemo } from 'react'
import { View } from 'react-native'
import Geolocation from 'react-native-geolocation-service'

import { useLocation } from '@/hooks/useLocation'
import { useNavigateWithPermissionCheck } from '@/hooks/useNavigationPermissionCheck'
import map from '@/services/map'
import { type PlaceType, useMapPlace, useParking, useToilet } from '@/services/place'

import { RefreshButton } from './RefreshButton'
import { WebView, type WebViewHandles } from '../common'
import { MapFAB } from './MapFAB'

import type { AuthStackParamList } from '@/types/navigation'

type MapViewProps = {
  activeCategory: string[]
  eyeState: boolean
  isToiletPressed: boolean
  isParkingPressed: boolean
}

export const PlaceMapView = ({
  activeCategory,
  eyeState,
  isToiletPressed,
  isParkingPressed,
}: MapViewProps) => {
  const webViewRef = useRef<WebViewHandles>(null)

  const [isMapLoaded, setIsMapLoaded] = useState(false) // 카카오맵 로드 상태

  const { location, refreshLocation } = useLocation()
  const [mapCenter, setMapCenter] = useState({
    lat: location.lat,
    lng: location.lng,
    level: 'LEVEL_3',
  })
  const [queryCenter, setQueryCenter] = useState({
    lat: location.lat,
    lng: location.lng,
    level: 'LEVEL_3',
  })
  const [isChangedMap, setIsChangedMap] = useState(false)
  const [isMyLocationActive, setIsMyLocationActive] = useState(false)

  const navigation = useNavigation<BottomTabNavigationProp<AuthStackParamList, 'MainTab'>>()
  const { navigateWithPermissionCheck } = useNavigateWithPermissionCheck()
  const bottomTabBarHeight = useBottomTabBarHeight()

  const { restaurantCategories, touristCategories } = useMemo(() => {
    const restaurantTypes = new Set(['NORMAL_RESTAURANT', 'SPECIAL_RESTAURANT'])
    return {
      restaurantCategories: activeCategory.filter(a => restaurantTypes.has(a)).join(','),
      touristCategories: activeCategory.filter(a => !restaurantTypes.has(a)).join(','),
    }
  }, [activeCategory])

  const shouldShowRefreshButton = useMemo(() => {
    const hasActiveFilters = activeCategory.length > 0 || isToiletPressed || isParkingPressed
    return isChangedMap && hasActiveFilters
  }, [isChangedMap, activeCategory, isToiletPressed, isParkingPressed])

  const { data: placeData } = useMapPlace({
    lat: queryCenter.lat,
    lng: queryCenter.lng,
    level: queryCenter.level,
    restaurantCategories,
    touristCategories,
    isEnabled: activeCategory.length > 0,
  })

  const { data: toiletData } = useToilet(
    queryCenter.lat,
    queryCenter.lng,
    queryCenter.level,
    isToiletPressed,
  )
  const { data: parkingData } = useParking(
    queryCenter.lat,
    queryCenter.lng,
    queryCenter.level,
    isParkingPressed,
  )

  useEffect(() => {
    const bridge = webViewRef.current?.bridge

    bridge?.onEvent('DRAG_START', () => {
      setIsChangedMap(true)
    })

    bridge?.onEvent('CENTER_CHANGE', data => {
      if (data.lat && data.lng && data.level) {
        setMapCenter(data)
      }
    })

    bridge?.onEvent('OVERLAY_CLICK', data => {
      if (data.id && data.type) {
        navigateWithPermissionCheck({
          navigation,
          routeName: 'MapStack',
          params: {
            screen: 'MapDetail',
            params: {
              id: data.id,
              type: data.type as PlaceType,
            },
          },
        })
      }
    })

    bridge?.onEvent('CONTENTS_LOADED', data => {
      if (data.loaded) {
        setIsMapLoaded(true)
      }
    })

    return () => {
      bridge?.offEvent('DRAG_START')
      bridge?.offEvent('CENTER_CHANGE')
      bridge?.offEvent('OVERLAY_CLICK')
      bridge?.offEvent('CONTENTS_LOADED')
    }
  }, [])

  const updateOverlays = useCallback(async () => {
    const bridge = webViewRef.current?.bridge
    if (!bridge || !isMapLoaded) return

    if (eyeState) {
      const data = [
        ...(placeData || []).map(r => ({
          id: r.id.toString(),
          category: r.category,
          type: r.type,
          lat: r.lat,
          lng: r.lng,
        })),
        ...(isToiletPressed && toiletData
          ? toiletData.map(r => ({
              id: r.toiletName,
              category: 'TOILET',
              lat: r.latitude,
              lng: r.longitude,
            }))
          : []),
        ...(isParkingPressed && parkingData
          ? parkingData.map(r => ({
              id: r.id.toString(),
              category: 'PARKING',
              lat: r.lat,
              lng: r.lng,
            }))
          : []),
      ]
      try {
        await bridge.sendRequest('GET_PLACE_DATA', data)
      } catch (error) {
        console.error('[ERROR] 오버레이 업데이트 실패:', error)
      }
    } else {
      try {
        await bridge.sendRequest('GET_OVERLAY_STATE', eyeState)
      } catch (error) {
        console.error('[ERROR] 오버레이 제거 실패:', error)
      }
    }
  }, [eyeState, placeData, toiletData, parkingData, isToiletPressed, isParkingPressed])

  useEffect(() => {
    if (isMapLoaded) {
      void updateOverlays()
    }
  }, [updateOverlays, isMapLoaded])

  useFocusEffect(
    useCallback(() => {
      void updateOverlays()
    }, [updateOverlays]),
  )

  useEffect(() => {
    // 활성화된 카테고리가 바뀌거나, MapFAB들을 클릭했을 때 isChangedMap 상태 초기화
    setIsChangedMap(false)
  }, [activeCategory, isToiletPressed, isParkingPressed])

  useEffect(() => {
    // 지도 중심이 변경될 때마다 현재 위치와 비교
    const isSameLocation =
      Math.abs(mapCenter.lat - location.lat) < 0.0001 &&
      Math.abs(mapCenter.lng - location.lng) < 0.0001

    setIsMyLocationActive(isSameLocation)
  }, [mapCenter])

  const updateLocation = useCallback(async (latlng: { lat: number; lng: number }) => {
    const bridge = webViewRef.current?.bridge
    if (!bridge) return

    try {
      await bridge.sendRequest('GET_CURRENT_LOCATION', latlng)
    } catch (error) {
      console.error('[ERROR] 현재 위치 표시 실패:', error)
    }
  }, [])

  useEffect(() => {
    if (!isMapLoaded) return

    const watchId = Geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords
        void updateLocation({ lat: latitude, lng: longitude })
      },
      error => console.log(error),
      { enableHighAccuracy: true, distanceFilter: 10, interval: 5000, fastestInterval: 2000 },
    )

    return () => Geolocation.clearWatch(watchId)
  }, [updateLocation])

  const handleLocationPress = async () => {
    if (!isMapLoaded) return

    const latlng = await refreshLocation()
    if (latlng) {
      try {
        await webViewRef.current?.bridge.sendRequest('GET_CURRENT_LOCATION', latlng)
      } catch (error) {
        console.error('[ERROR] 현재 위치 전송 실패:', error)
      }
    }
  }

  const handleFindWayPress = () => {
    navigateWithPermissionCheck({
      navigation,
      routeName: 'SearchStack',
      params: { screen: 'FindWay' },
    })
  }

  const handleRefresh = useCallback(() => {
    setIsChangedMap(false)
    setQueryCenter(mapCenter)
  }, [mapCenter])

  return (
    <>
      <View
        className="absolute bottom-12 right-4 z-[2] flex gap-2"
        style={{
          paddingBottom: bottomTabBarHeight,
        }}
      >
        {/* 길찾기 표시 버튼 */}
        <MapFAB onPress={handleFindWayPress} iconName="findWay" />
        {/* 내 위치 버튼 */}
        <MapFAB onPress={handleLocationPress} iconName="position" enabled={isMyLocationActive} />
      </View>
      {/* 지도 웹뷰 */}
      <WebView
        ref={webViewRef}
        source={{ html: map }}
        injectedJavaScript={`
          kakao.maps.load(function(){
            createMap(${JSON.stringify(location)});
            addMyLocationMarker(${JSON.stringify(location)})
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
      {/* 현재 위치에서 재검색 버튼 */}
      {shouldShowRefreshButton && (
        <View className="flex-row items-center justify-center">
          <View
            className="absolute bottom-12 z-[2]"
            style={{
              paddingBottom: bottomTabBarHeight,
            }}
          >
            <RefreshButton onPress={handleRefresh} />
          </View>
        </View>
      )}
    </>
  )
}
