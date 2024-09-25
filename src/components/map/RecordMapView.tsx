import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useCallback, useRef, useState } from 'react'
import { WebView, type WebViewMessageEvent } from 'react-native-webview'

import { navigateWithPermissionCheck } from '@/hooks/useNavigationPermissionCheck'
import map from '@/services/map'
import { useMapRecord } from '@/services/record'

import type { RootStackParamList } from '@/types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'

type ReturnProps = {
  type: string
  data: {
    zoomLevel?: string
    lat?: number
    lng?: number
    type?: string
    id?: number
  }
}

type ResponseType = {
  id: string
  category: string
  lat: number
  lng: number
  url?: string
}

type MapViewProps = {
  location: { lng: number; lat: number }
  isLocationPressed: boolean
}

export const RecordMapView = React.memo(({ location, isLocationPressed }: MapViewProps) => {
  const webViewRef = useRef<WebView>(null)
  const [nowLat, setNowLat] = useState(location.lat)
  const [nowLng, setNowLng] = useState(location.lng)
  const [zoomLevel, setZoomLevel] = useState('LEVEL_3')

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const { data: recordData } = useMapRecord(nowLat, nowLng, zoomLevel)

  const updateOverlays = useCallback(() => {
    if (!webViewRef.current) return

    if (recordData) {
      const data: ResponseType[] = recordData.map(r => ({
        id: r.id.toString(),
        category: 'RECORD',
        lat: r.lat,
        lng: r.lng,
        // url: r.imageUrl ? `${process.env.IMAGE_URL}/postImage/${r.imageUrl}` : undefined,
      }))

      console.log(data)

      webViewRef.current.injectJavaScript(`settingImageOverlays(${JSON.stringify(data)})`)
    } else {
      webViewRef.current.injectJavaScript('initOverlays()') // 데이터가 없을 경우 오버레이 초기화
    }
  }, [recordData])

  useEffect(() => {
    updateOverlays()
  }, [updateOverlays])

  useEffect(() => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`moveMap(${JSON.stringify(location)})`)
    }
  }, [isLocationPressed, location])

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const eventData: ReturnProps = JSON.parse(event.nativeEvent.data)

      switch (eventData.type) {
        case 'zoomChanged':
          if (eventData.data.zoomLevel) setZoomLevel(eventData.data.zoomLevel)
          break
        case 'dragend':
          if (eventData.data.lat && eventData.data.lng) {
            setNowLat(eventData.data.lat)
            setNowLng(eventData.data.lng)
          }
          break
        case 'overlayClick':
          console.log(eventData.data)
          if (eventData.data.id) {
            navigateWithPermissionCheck({
              navigation,
              routeName: 'MainTab',
              params: {
                screen: 'Record',
                params: {
                  screen: 'ReadRecord',
                  params: { id: eventData.data.id },
                },
              },
            })
          }
          break
      }
    },
    [navigation],
  )

  return (
    <WebView
      ref={webViewRef}
      source={{ html: map }}
      injectedJavaScript={`
        kakao.maps.load(function(){
          const map = createMap(${JSON.stringify(location)});
        });
      `}
      onMessage={handleMessage}
      javaScriptEnabled
      domStorageEnabled
      cacheEnabled={false}
    />
  )
})
