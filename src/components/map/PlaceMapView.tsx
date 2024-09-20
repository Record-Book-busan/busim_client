import { type BottomTabNavigationProp, useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useCallback, useMemo, useRef, useState } from 'react'
import { View } from 'react-native'
import { WebView, type WebViewMessageEvent } from 'react-native-webview'

import map from '@/services/map'
import { type PlaceType, useMapPlace, useParking, useToilet } from '@/services/place'

import { RefreshButton } from './RefreshButton'

import type { RootStackParamList } from '@/types/navigation'

type ReturnProps = {
  type: string
  data: {
    zoomLevel: string
    lat: number
    lng: number
    type: string
    id: number
  }
}

type MapViewProps = {
  activeCategory: string[]
  eyeState: boolean
  location: { lng: number; lat: number }
  isLocationPressed: boolean
  isToiletPressed: boolean
  isParkingPressed: boolean
}

export const PlaceMapView = ({
  activeCategory,
  eyeState,
  location,
  isLocationPressed,
  isToiletPressed,
  isParkingPressed,
}: MapViewProps) => {
  const webViewRef = useRef<WebView>(null)
  const [mapCenter, setMapCenter] = useState(location)
  const [queryCenter, setQueryCenter] = useState(location)
  const [zoomLevel, setZoomLevel] = useState('LEVEL_3')
  const [queryZoomLevel, setQueryZoomLevel] = useState('LEVEL_3')
  const [needsRefresh, setNeedsRefresh] = useState(false)
  const navigation = useNavigation<BottomTabNavigationProp<RootStackParamList, 'MainTab'>>()
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
    if (!webViewRef.current) return

    if (eyeState) {
      const data = [
        ...(placeData || []).map(r => ({
          title: r.id.toString(),
          category: r.category,
          type: r.type,
          lat: r.lat,
          lng: r.lng,
        })),
        ...(isToiletPressed && toiletData
          ? toiletData.map(r => ({
              title: r.toiletName,
              category: 'TOILET',
              lat: r.latitude,
              lng: r.longitude,
            }))
          : []),
        ...(isParkingPressed && parkingData
          ? parkingData.map(r => ({
              title: r.id.toString(),
              category: 'PARKING',
              lat: r.lat,
              lng: r.lng,
            }))
          : []),
      ]
      webViewRef.current.injectJavaScript(
        `settingPlaceOverlays(${JSON.stringify(activeCategory)}, ${JSON.stringify(data)})`,
      )
    } else {
      // eyeState가 false일 때 오버레이 제거
      webViewRef.current.injectJavaScript('removeOverlays();')
    }
  }, [
    eyeState,
    zoomLevel,
    mapCenter,
    placeData,
    toiletData,
    parkingData,
    activeCategory,
    isToiletPressed,
    isParkingPressed,
  ])

  useEffect(() => {
    setQueryCenter(mapCenter)
    setQueryZoomLevel(zoomLevel)
    setNeedsRefresh(false)
  }, [activeCategory, isToiletPressed, isParkingPressed])

  useEffect(() => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`moveMap(${JSON.stringify(location)})`)
    }
  }, [isLocationPressed, location])

  const handleRefresh = useCallback(() => {
    setQueryCenter(mapCenter)
    setQueryZoomLevel(zoomLevel)
    setNeedsRefresh(false)
  }, [mapCenter, zoomLevel])

  const handleMessage = (event: WebViewMessageEvent) => {
    const eventData: ReturnProps = JSON.parse(event.nativeEvent.data)

    switch (eventData.type) {
      case 'zoomChanged':
        setZoomLevel(eventData.data.zoomLevel)
        setNeedsRefresh(true)
        break
      case 'dragend':
        setMapCenter({ lat: eventData.data.lat, lng: eventData.data.lng })
        setNeedsRefresh(true)
        break
      case 'overlayClick':
        console.log(eventData.data.type)
        navigation.navigate('MapStack', {
          screen: 'MapDetail',
          params: {
            id: eventData.data.id,
            type: eventData.data.type as PlaceType,
          },
        })
        break
    }
  }

  const isRefreshNeeded =
    needsRefresh &&
    activeCategory.length > 0 &&
    (mapCenter.lat !== queryCenter.lat ||
      mapCenter.lng !== queryCenter.lng ||
      zoomLevel !== queryZoomLevel)

  return (
    <>
      <WebView
        ref={webViewRef}
        source={{ html: map }}
        injectedJavaScript={`
          kakao.maps.load(function(){
            const map = createMap(${JSON.stringify(location)})
          })
        `}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        cacheEnabled={false}
      />
      {isRefreshNeeded && (
        <View className="flex-row items-center justify-center">
          <View
            className="absolute bottom-4 z-[2]"
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
