import { useEffect, useRef } from 'react'
import { WebView } from 'react-native-webview'

import map from '@/services/map/map'

function MapView({ activeCategory }: { activeCategory: number[] }) {
  const webViewRef = useRef(null)

  useEffect(() => {
    if (webViewRef.current) {
      const script = `settingPlaceMarkers(${JSON.stringify(activeCategory)})`

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      ;(webViewRef.current as any).injectJavaScript(script)
    }
  }, [activeCategory])

  const initFn = `
    kakao.maps.load(function(){ 
      createMap()
      
      // settingPlaceMarkers(${JSON.stringify(activeCategory)})
      // kakao.maps.event.addListener(map, 'zoom_changed', () => {
      //   settingPlaceMarkers(${JSON.stringify(activeCategory)})
      // })

      settingImageMarkers()
      kakao.maps.event.addListener(map, 'zoom_changed', settingImageMarkers)

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
