import { useEffect, useRef } from 'react'
import { WebView } from 'react-native-webview'

import map from '@/services/map/map'

type MapViewProps = {
  activeCategory: string[]
  eyeState: boolean
  location: {
    lng: number
    lat: number
  }
  locationPressed: boolean
  isTrafficPressed: boolean
  refresed: boolean
}

function MapView({
  activeCategory,
  eyeState,
  location,
  locationPressed,
  isTrafficPressed,
  refresed,
}: MapViewProps) {
  const webViewRef = useRef<WebView>(null)

  useEffect(() => {
    if (webViewRef.current) {
      const script = eyeState
        ? `
        kakao.maps.event.removeListener(map, 'bounds_changed', initOverlays())
        settingPlaceOverlays(${JSON.stringify(activeCategory)})
        kakao.maps.event.addListener(map, 'bounds_changed', settingPlaceOverlays(${JSON.stringify(activeCategory)}))
      `
        : `
        kakao.maps.event.removeListener(map, 'bounds_changed', settingPlaceOverlays(${JSON.stringify(activeCategory)}))
        initOverlays()
        kakao.maps.event.addListener(map, 'bounds_changed', initOverlays())
      `

      webViewRef.current.injectJavaScript(script)
    }
  }, [activeCategory, eyeState, location, refresed])

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

  const testData = `
    [
      {
          title: '카카오', 
          type: 'TOURIST_SPOT',
          lat: 33.450705,
          lng: 126.570677
      },
      {
          title: '생태연못', 
          type: 'TOURIST_SPOT',
          lat: 33.450936,
          lng: 126.569477
      },
    ]
  `

  const initFn = `
    kakao.maps.load(function(){
      createMap(${JSON.stringify(location)})

      settingPlaceOverlays(${(JSON.stringify(activeCategory), JSON.stringify(testData))})

      // settingImageOverlays()
      // kakao.maps.event.addListener(map, 'bounds_changed', settingImageOverlays)

      document.addEventListener('click', function(event) {
        if (event.target.classList.contains('customoverlay')) {
          const dataKey = event.target.getAttribute('data-key');
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'overlayClicked', data: dataKey }))
        }
      })
    })
  `

  return (
    <WebView
      ref={webViewRef}
      source={{ html: map }}
      injectedJavaScript={initFn}
      onMessage={event => {
        console.log('Message from WebView:', event.nativeEvent.data)
      }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}

      // onError={syntheticEvent => {
      //   const { nativeEvent } = syntheticEvent
      //   console.warn('WebView error: ', nativeEvent)
      // }}

      // onMessage={(event) => {
      // const response = JSON.parse(event.nativeEvent.data)
      // if(response.type === 'overlayClicked') {
      //   console.log(response.data)
      // }
      // }}
    />
  )
}

export default MapView
