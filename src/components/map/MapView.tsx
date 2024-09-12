import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview'

import map from '@/services/map/map'
import { getCategory, getParking, getToilet } from '@/services/service'
import { RootStackParamList } from '@/types/navigation'

import type { StackNavigationProp } from '@react-navigation/stack'

type MapViewProps = {
  activeCategory: string[]
  eyeState: boolean
  location: {
    lng: number
    lat: number
  }
  locationPressed: boolean
  isToiletPressed: boolean
  isTrafficPressed: boolean
  refreshed: boolean
}

type responseType = {
  id: number
  lat: number
  lng: number
  imageUrl: string[]
  category: string
}

type returnProps = {
  type: string
  data: {
    zoomLevel: string
    lat: number
    lng: number
    type: string
    id: string
  }
}

type getToiletResponseType = {
  toiletName: string
  latitude: number
  longitude: number
  phoneNumber: string
  openingHours: string
}

type getParkingResponseType = {
  id: number
  lat: number
  lng: number
  jibunAddr: string
  pkFm: string
  pkCnt: 0
  svcSrtTe: string
  svcEndTe: string
  tenMin: 0
  ftDay: 0
  ftMon: 0
  pkGubun: string
}

const MapView = React.memo(function MapView({
  activeCategory,
  eyeState,
  location,
  locationPressed,
  isToiletPressed,
  isTrafficPressed,
  refreshed,
}: MapViewProps) {
  const webViewRef = useRef<WebView>(null)
  const [zoomLevel, setZoomLevel] = useState<string>('LEVEL_3')
  const [nowLat, setNowLat] = useState<number>(location.lat)
  const [nowLng, setNowLng] = useState<number>(location.lng)
  const [loading, setLoading] = useState<boolean>(false)

  const initFn = `
    kakao.maps.load(function(){
      const map = createMap(${JSON.stringify(location)})
    })
  `

  const fetchData = useCallback(async () => {
    if (webViewRef.current) {
      try {
        if (activeCategory.length === 0 || !eyeState) {
          webViewRef.current.injectJavaScript('initOverlays()')
        } else {
          setLoading(true)

          const response: responseType[] = await getCategory({
            lat: nowLat || location.lat,
            lng: nowLng || location.lng,
            level: zoomLevel,
            restaurantCategories: activeCategory
              .filter(a => a === 'NORMAL_RESTAURANT' || a === 'SPECIAL_RESTAURANT')
              .toString(),
            touristCategories: activeCategory
              .filter(a => a !== 'NORMAL_RESTAURANT' && a !== 'SPECIAL_RESTAURANT')
              .toString(),
          })

          const data: {
            title: string
            type: string
            lat: number
            lng: number
          }[] = []

          response.map(r => {
            const d = {
              title: r.id.toString(),
              type: r.category,
              lat: r.lat,
              lng: r.lng,
            }

            data.push(d)
          })

          webViewRef.current.injectJavaScript(
            `settingPlaceOverlays(${JSON.stringify(activeCategory)}, ${JSON.stringify(data)})`,
          )
        }
      } catch (err: any) {
        console.log(`error: ${err}`)
      } finally {
        setLoading(false)
      }
    }
  }, [activeCategory, eyeState, location, zoomLevel, nowLat, nowLng])

  const fetchToiletData = async () => {
    if (webViewRef.current) {
      try {
        setLoading(true)

        const response: getToiletResponseType[] = await getToilet({
          lat: nowLat || location.lat,
          lng: nowLng || location.lng,
          level: zoomLevel,
        })

        const data: {
          title: string
          type: string
          lat: number
          lng: number
        }[] = []

        response.map(r => {
          const d = {
            title: r.toiletName,
            type: 'TOILET',
            lat: r.latitude,
            lng: r.longitude,
          }

          data.push(d)
        })

        webViewRef.current.injectJavaScript(
          `settingPlaceOverlays(['TOILET'], ${JSON.stringify(response)})`,
        )
      } catch (err: any) {
        console.log(`error: ${err}`)
      } finally {
        setLoading(false)
      }
    }
  }

  const fetchParkingData = async () => {
    if (webViewRef.current) {
      try {
        setLoading(true)

        const response: getParkingResponseType[] = await getParking({
          lat: nowLat || location.lat,
          lng: nowLng || location.lng,
          level: zoomLevel,
        })

        const data: {
          title: string
          type: string
          lat: number
          lng: number
        }[] = []

        response.map(r => {
          const d = {
            title: r.id.toString(),
            type: 'PARKING',
            lat: r.lat,
            lng: r.lng,
          }

          data.push(d)
        })

        webViewRef.current.injectJavaScript(
          `settingPlaceOverlays(['Parking'], ${JSON.stringify(response)})`,
        )
      } catch (err: any) {
        console.log(`error: ${err}`)
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    void fetchData()
  }, [fetchData, refreshed])

  useEffect(() => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`moveMap(${JSON.stringify(location)})`)
    }
  }, [locationPressed, location])

  useEffect(() => {
    if (isToiletPressed && eyeState) void fetchToiletData()
    else webViewRef.current?.injectJavaScript('initToiletOverlays()')
  }, [isToiletPressed, zoomLevel, nowLat, nowLng])

  useEffect(() => {
    if (isTrafficPressed && eyeState) void fetchParkingData()
    else webViewRef.current?.injectJavaScript('initParkingOverlays()')
  }, [isTrafficPressed, zoomLevel, nowLat, nowLng])

  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'SearchStack'>>()

  const navigateToDetail = (id: number) => {
    navigation.navigate('SearchStack', { screen: 'Detail', params: { id: id } })
  }

  const handleMessage = useCallback((event: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const eventData: returnProps = JSON.parse(event.nativeEvent.data)

    if (eventData.type === 'zoomChanged') {
      setZoomLevel(eventData.data.zoomLevel)
    }

    if (eventData.type === 'dragend') {
      setNowLat(eventData.data.lat)
      setNowLng(eventData.data.lng)
    }

    if (eventData.type === 'overlayClick') {
      console.log(eventData.data.id)
      navigateToDetail(parseInt(eventData.data.id))
    }
  }, [])

  return (
    <>
      {loading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 100,
          }}
        >
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-md mt-2 text-white">Now loading...</Text>
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ html: map }}
        injectedJavaScript={initFn}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
      />
    </>
  )
})

export default MapView
