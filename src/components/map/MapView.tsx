/* eslint-disable @typescript-eslint/no-unused-vars */
import { type CompositeNavigationProp, useNavigation } from '@react-navigation/native'
import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview'

import map from '@/services/map/map'
import { PlaceType } from '@/services/place'
import { getCategory, getParking, getRecord, getToilet } from '@/services/service'
import { MapStackParamList, RootStackParamList } from '@/types/navigation'

import type { StackNavigationProp } from '@react-navigation/stack'

type MapViewProps = {
  mapType: 'place' | 'record'
  activeCategory: string[]
  eyeState: boolean
  location: {
    lng: number
    lat: number
  }
  locationPressed: boolean
  isToiletPressed?: boolean
  isTrafficPressed?: boolean
  refreshed?: boolean
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

type getCategoryResponseType = {
  id: number
  lat: number
  lng: number
  imageUrl: string[]
  category: string
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

type getRecordResponseType = {
  id: number
  imageUrl: string
  lat: number
  lng: number
}

type responseType = {
  title: string
  type: string
  lat: number
  lng: number
  url?: string
}

function MapView({
  mapType,
  activeCategory,
  eyeState,
  location,
  locationPressed,
  isToiletPressed,
  isTrafficPressed,
  refreshed,
}: MapViewProps) {
  const webViewRef = useRef<WebView>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [nowLat, setNowLat] = useState<number>(location.lat)
  const [nowLng, setNowLng] = useState<number>(location.lng)
  const [zoomLevel, setZoomLevel] = useState<string>('LEVEL_3')

  const initFn = useMemo(() => {
    return `
      kakao.maps.load(function(){
        const map = createMap(${JSON.stringify(location)})
      })
    `
  }, [])

  const fetchCategory = async (): Promise<responseType[]> => {
    try {
      const response: getCategoryResponseType[] = await getCategory({
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

      const data: responseType[] = []

      response.map(r => {
        const d = {
          title: r.id.toString(),
          type: r.category,
          lat: r.lat,
          lng: r.lng,
        }

        data.push(d)
      })

      return data
    } catch (err: any) {
      console.log(`error: ${err}`)

      return []
    }
  }

  const fetchToiletData = async (): Promise<responseType[]> => {
    try {
      const response: getToiletResponseType[] = await getToilet({
        lat: nowLat || location.lat,
        lng: nowLng || location.lng,
        level: zoomLevel,
      })

      const data: responseType[] = []

      response.map(r => {
        const d = {
          title: r.toiletName,
          type: 'TOILET',
          lat: r.latitude,
          lng: r.longitude,
        }

        data.push(d)
      })

      return data
    } catch (err: any) {
      console.log(`error: ${err}`)

      return []
    }
  }

  const fetchParkingData = async (): Promise<responseType[]> => {
    try {
      const response: getParkingResponseType[] = await getParking({
        lat: nowLat || location.lat,
        lng: nowLng || location.lng,
        level: zoomLevel,
      })

      const data: responseType[] = []

      response.map(r => {
        const d = {
          title: r.id.toString(),
          type: 'PARKING',
          lat: r.lat,
          lng: r.lng,
        }

        data.push(d)
      })

      return data
    } catch (err: any) {
      console.log(`error: ${err}`)

      return []
    }
  }

  const fetchRecordData = async (): Promise<responseType[]> => {
    try {
      const response: getRecordResponseType[] = await getRecord({
        lat: nowLat || location.lat,
        lng: nowLng || location.lng,
        level: zoomLevel,
      })

      const data: responseType[] = []

      response.map(r => {
        const d = {
          title: r.id.toString(),
          type: 'RECORD',
          lat: r.lat,
          lng: r.lng,
          url: `${process.env.IMAGE_URL}/postImage/${r.imageUrl}`,
        }

        data.push(d)
      })

      return data
    } catch (err: any) {
      console.log(`error: ${err}`)

      return []
    }
  }

  const fetchData = useCallback(async () => {
    if (webViewRef.current) {
      try {
        if (
          !eyeState ||
          (mapType === 'place' &&
            activeCategory.length === 0 &&
            !isToiletPressed &&
            !isTrafficPressed)
        ) {
          webViewRef.current.injectJavaScript('initOverlays()')
        } else {
          const data: responseType[] = []

          if (mapType === 'place') {
            const categoryPromise =
              activeCategory.length !== 0 ? fetchCategory() : Promise.resolve([])
            const toiletPromise = isToiletPressed ? fetchToiletData() : Promise.resolve([])
            const parkingPromise = isTrafficPressed ? fetchParkingData() : Promise.resolve([])

            const [categoryData, toiletData, parkingData] = await Promise.all([
              categoryPromise,
              toiletPromise,
              parkingPromise,
            ])

            data.push(...categoryData, ...toiletData, ...parkingData)

            webViewRef.current.injectJavaScript(
              `settingPlaceOverlays(${JSON.stringify(activeCategory)}, ${JSON.stringify(data)})`,
            )
          }

          if (mapType === 'record') {
            const recordPromise = await fetchRecordData()

            data.push(...recordPromise)

            webViewRef.current.injectJavaScript(
              `settingImageOverlays(${JSON.stringify(activeCategory)}, ${JSON.stringify(data)})`,
            )
          }
        }
      } catch (err: any) {
        console.log(`error: ${err}`)
      } finally {
        setLoading(false)
      }
    }
  }, [
    activeCategory,
    eyeState,
    isToiletPressed,
    isTrafficPressed,
    location,
    zoomLevel,
    nowLat,
    nowLng,
  ])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  useEffect(() => {
    setLoading(true)
    void fetchData()
  }, [refreshed])

  useEffect(() => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`moveMap(${JSON.stringify(location)})`)
    }
  }, [locationPressed])

  const navigation =
    useNavigation<
      CompositeNavigationProp<
        StackNavigationProp<MapStackParamList, 'MapMain'>,
        StackNavigationProp<RootStackParamList>
      >
    >()

  // TODO: 백엔드 api 수정 후에 네비게이트 처리하기. 지금은 type을 잘못 받고 있어서 에러남...
  const navigateToDetail = (type: string, id: number) => {
    if (type === 'record')
      navigation.navigate('RecordStack', { screen: 'ReadRecord', params: { id: id } })
    else navigation.navigate('MapDetail', { id: id, type: type as PlaceType })
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
      console.log(eventData.type, eventData.data)
      // navigateToDetail(eventData.data.type, parseInt(eventData.data.id))
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
        cacheEnabled={false}
      />
    </>
  )
}

export default MapView
