import { type BottomTabNavigationProp, useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useCallback, useRef, useState, useMemo } from 'react'
import { View } from 'react-native'

import { useLocation } from '@/hooks/useLocation'
import { useNavigateWithPermissionCheck } from '@/hooks/useNavigationPermissionCheck'
import map from '@/services/map'
import { type PlaceType, useMapPlace, useParking, useToilet } from '@/services/place'

import { RefreshButton } from './RefreshButton'
import { WebView, WebViewBridge, type WebViewEl } from '../common'
import { MapFAB } from './MapFAB'

import type { RootStackParamList } from '@/types/navigation'

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

  const navigation = useNavigation<BottomTabNavigationProp<RootStackParamList, 'MainTab'>>()
  const { navigateWithPermissionCheck } = useNavigateWithPermissionCheck()
  const bottomTabBarHeight = useBottomTabBarHeight()

  const { restaurantCategories, touristCategories } = useMemo(() => {
    const restaurantTypes = new Set(['NORMAL_RESTAURANT', 'SPECIAL_RESTAURANT'])
    return {
      restaurantCategories: activeCategory.filter(a => restaurantTypes.has(a)).join(','),
      touristCategories: activeCategory.filter(a => !restaurantTypes.has(a)).join(','),
    }
  }, [activeCategory])

  const { data: placeData } = useMapPlace({
    lat: queryCenter.lat,
    lng: queryCenter.lng,
    level: queryZoomLevel,
    restaurantCategories,
    touristCategories,
    isEnabled: activeCategory.length > 0,
  })

  const { data: toiletData } = useToilet(
    queryCenter.lat,
    queryCenter.lng,
    queryZoomLevel,
    isToiletPressed,
  )
  const { data: parkingData } = useParking(
    queryCenter.lat,
    queryCenter.lng,
    queryZoomLevel,
    isParkingPressed,
  )

  useEffect(() => {
    webViewBridge.onEvent('ZOOM_CHANGE', data => {
      if (data.zoomLevel) {
        setZoomLevel(data.zoomLevel)
        setIsChangedMap(true)
      }
    })

    webViewBridge.onEvent('POSITION_CHANGE', data => {
      if (data.lat && data.lng) {
        setMapCenter({ lat: data.lat, lng: data.lng })
        setIsChangedMap(true)
      }
    })

    webViewBridge.onEvent('OVERLAY_CLICK', data => {
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

    return () => {
      webViewBridge.offEvent('ZOOM_CHANGE')
      webViewBridge.offEvent('POSITION_CHANGE')
      webViewBridge.offEvent('OVERLAY_CLICK')
    }
  }, [])

  const updateOverlays = useCallback(async () => {
    if (!webViewBridge) return

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
        await webViewBridge.sendRequest('GET_PLACE_DATA', data)
      } catch (error) {
        console.error('[ERROR] 오버레이 업데이트 실패:', error)
      }
    } else {
      try {
        await webViewBridge.sendRequest('GET_OVERLAY_STATE', eyeState)
      } catch (error) {
        console.error('[ERROR] 오버레이 제거 실패:', error)
      }
    }
  }, [eyeState, placeData, toiletData, parkingData, isToiletPressed, isParkingPressed])

  useEffect(() => {
    void updateOverlays()
  }, [updateOverlays])

  useEffect(() => {
    // 활성화된 카테고리가 바뀌거나, MapFAB들을 클릭했을 때 isChangedMap 상태 초기화
    setIsChangedMap(false)
  }, [activeCategory, isToiletPressed, isParkingPressed])

  useEffect(() => {
    // 지도 중심이 변경될 때마다 현재 위치와 비교
    const isSameLocation =
      Math.abs(mapCenter.lat - currentLocation.lat) < 0.0001 &&
      Math.abs(mapCenter.lng - currentLocation.lng) < 0.0001

    console.log('isSameLocation', mapCenter.lat, currentLocation.lat)
    console.log('isSameLocation', mapCenter.lng, currentLocation.lng)

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

  const handleFindWayPress = () => {
    navigateWithPermissionCheck({
      navigation,
      routeName: 'SearchStack',
      params: { screen: 'FindWay' },
    })
  }

  const handleRefresh = useCallback(() => {
    setQueryCenter(mapCenter)
    setQueryZoomLevel(zoomLevel)
    setIsChangedMap(false)
  }, [mapCenter])

  return (
    <>
      <View
        className="absolute bottom-10 right-4 z-[2] flex gap-4"
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
            const map = createMap(${JSON.stringify(location)})
          })
        `}
        onMessage={webViewBridge.handleMessage}
        javaScriptEnabled
        domStorageEnabled
        debug={true}
      />
      {/* 현재 위치에서 재검색 버튼 */}
      {isChangedMap && activeCategory.length > 0 && (
        <View className="flex-row items-center justify-center">
          <View
            className="absolute bottom-10 z-[2]"
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
