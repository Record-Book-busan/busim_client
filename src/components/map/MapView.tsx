import React, { useEffect, useRef, useState, useCallback } from 'react'
import { WebView } from 'react-native-webview'

import map from '@/services/map/map'
import { getCategory } from '@/services/service'

type MapViewProps = {
  activeCategory: string[]
  eyeState: boolean
  location: {
    lng: number
    lat: number
  }
  locationPressed: boolean
  isTrafficPressed: boolean
  refreshed: boolean
}

const MapView = React.memo(function MapView({
  activeCategory,
  eyeState,
  location,
  locationPressed,
  isTrafficPressed,
  refreshed,
}: MapViewProps) {
  const webViewRef = useRef<WebView>(null)
  const [zoomLevel, setZoomLevel] = useState<string>('LEVEL_3')
  const [nowLat, setNowLat] = useState<number>()
  const [nowLng, setNowLng] = useState<number>()

  type responseType = {
    id: number
    lat: number
    lng: number
    imageUrl: string[]
    category: string
  }

  const fetchData = useCallback(async () => {
    if (webViewRef.current) {
      try {
        if (activeCategory.length === 0) {
          webViewRef.current.injectJavaScript('initOverlays()')
        } else {
          const response: responseType = await getCategory({
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

          webViewRef.current.injectJavaScript(
            `settingPlaceOverlays(${JSON.stringify(eyeState)}, ${JSON.stringify(activeCategory)}, ${JSON.stringify(response)})`,
          )
        }
      } catch (err: any) {
        console.log(`error: ${err}`)
      }
    }
  }, [activeCategory, eyeState, location, zoomLevel, nowLat, nowLng])

  useEffect(() => {
    void fetchData()
  }, [fetchData, refreshed])

  useEffect(() => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`moveMap(${JSON.stringify(location)})`)
    }
  }, [locationPressed, location])

  useEffect(() => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`showTrfficInfo(${JSON.stringify(isTrafficPressed)})`)
    }
  }, [isTrafficPressed])

  const initFn = `
    kakao.maps.load(function(){
      createMap(${JSON.stringify(location)})

      kakao.maps.event.addListener(map, 'zoom_changed', function(event) {
        const data = 'LEVEL_' + map.getLevel()

        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'zoomChanged', data: { zoomLevel: data } }))
      })

      kakao.maps.event.addListener(map, 'dragend', function() {
        const data = map.getCenter()

        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'dragend', data: { lat: data.getLat(), lng: data.getLng() } }))
      })
    })
  `

  type returnProps = {
    type: string
    data: {
      zoomLevel: string
      lat: number
      lng: number
    }
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
  }, [])

  return (
    <WebView
      ref={webViewRef}
      source={{ html: map }}
      injectedJavaScript={initFn}
      onMessage={handleMessage}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
    />
  )
})

export default MapView
