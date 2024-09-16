import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useCallback, useRef, useState } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { WebView, type WebViewMessageEvent } from 'react-native-webview'

import map from '@/services/map/map'
import { useMapRecord } from '@/services/record'

import type { RootStackParamList } from '@/types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'

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

type ResponseType = {
  title: string
  type: string
  lat: number
  lng: number
  url?: string
}

type MapViewProps = {
  activeCategory: string[]
  eyeState: boolean
  location: { lng: number; lat: number }
  locationPressed: boolean
}

export const RecordMapView = React.memo(
  ({ activeCategory, eyeState, location, locationPressed }: MapViewProps) => {
    const webViewRef = useRef<WebView>(null)
    const [loading, setLoading] = useState(false)
    const [nowLat, setNowLat] = useState(location.lat)
    const [nowLng, setNowLng] = useState(location.lng)
    const [zoomLevel, setZoomLevel] = useState('LEVEL_3')

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
    const { data: recordData } = useMapRecord(nowLat, nowLng, zoomLevel)

    const updateOverlays = useCallback(() => {
      if (!webViewRef.current || !eyeState) return

      const data: ResponseType[] = []

      if (recordData) {
        data.push(
          ...recordData.map(r => ({
            title: r.id.toString(),
            type: 'RECORD',
            lat: r.lat,
            lng: r.lng,
            url: `${process.env.IMAGE_URL}/postImage/${r.imageUrl}`,
          })),
        )
      }

      webViewRef.current.injectJavaScript(
        `settingImageOverlays(${JSON.stringify(activeCategory)}, ${JSON.stringify(data)})`,
      )
    }, [webViewRef, eyeState, activeCategory, recordData])

    useEffect(() => {
      updateOverlays()
    }, [updateOverlays])

    useEffect(() => {
      setLoading(true)
      updateOverlays()
      setLoading(false)
    }, [])

    useEffect(() => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`moveMap(${JSON.stringify(location)})`)
      }
    }, [locationPressed, location])

    const handleMessage = useCallback((event: WebViewMessageEvent) => {
      const eventData: ReturnProps = JSON.parse(event.nativeEvent.data)

      switch (eventData.type) {
        case 'zoomChanged':
          setZoomLevel(eventData.data.zoomLevel)
          break
        case 'dragend':
          setNowLat(eventData.data.lat)
          setNowLng(eventData.data.lng)
          break
        case 'overlayClick':
          navigateToDetail(eventData.data.id)
          break
      }
    }, [])

    const navigateToDetail = (id: number) => {
      navigation.navigate('RecordStack', { screen: 'ReadRecord', params: { id } })
    }

    return (
      <>
        {loading && (
          <View className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <ActivityIndicator size="large" color="#ffffff" />
            <Text className="mt-2 text-lg text-white">Now loading...</Text>
          </View>
        )}
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
      </>
    )
  },
)
