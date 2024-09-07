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
      settingPlaceMarkers(${JSON.stringify(activeCategory)})
      kakao.maps.event.addListener(map, 'zoom_changed', () => {
        settingPlaceMarkers(${JSON.stringify(activeCategory)})
      })

      // settingImageMarkers()
      // kakao.maps.event.addListener(map, 'zoom_changed', settingImageMarkers)
    })
  `

  return <WebView ref={webViewRef} source={{ html: map }} injectedJavaScript={initFn} />
}

export default MapView
