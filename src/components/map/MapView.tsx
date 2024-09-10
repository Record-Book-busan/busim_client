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
  const webViewRef = useRef(null)

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

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      ;(webViewRef.current as any).injectJavaScript(script)
    }
  }, [activeCategory, eyeState, location, refresed])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    ;(webViewRef.current as any).injectJavaScript(`moveMap(${JSON.stringify(location)})`)
  }, [locationPressed])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    ;(webViewRef.current as any).injectJavaScript(
      `showTrfficInfo(${JSON.stringify(isTrafficPressed)})`,
    )
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
      javaScriptEnabled={true}
      domStorageEnabled={true}
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
