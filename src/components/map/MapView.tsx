import { useEffect, useRef } from 'react'
// import { useEffect, useRef, useState } from 'react'
import { WebView } from 'react-native-webview'

// import { getCategory } from '@/services/service'
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
  refreshed: boolean
}

function MapView({
  // activeCategory,
  // eyeState,
  location,
  locationPressed,
  isTrafficPressed,
  // refreshed,
}: MapViewProps) {
  const webViewRef = useRef<WebView>(null)
  // const [zoomLevel, setZoomLevel] = useState('LEVEL_3')

  // const handleBoundsChanged = async () => {
  //   let memorize

  //   async function changeScripts() {
  //     if (eyeState) {
  //       try {
  //         console.log(location)
  //         const fetchData = await getCategory({
  //           lat: location.lat,
  //           lng: location.lng,
  //           level: zoomLevel,
  //           restaurantCategories: activeCategory
  //             .filter(a => a === 'NORMAL_RESTAURANT' || a === 'SPECIAL_RESTAURANT')
  //             .toString(),
  //           touristCategories: activeCategory
  //             .filter(a => a !== 'NORMAL_RESTAURANT' && a !== 'SPECIAL_RESTAURANT')
  //             .toString(),
  //         })

  //         memorize = `settingPlaceOverlays(${JSON.stringify(activeCategory)}, ${JSON.stringify(fetchData)})`
  //         return `settingPlaceOverlays(${JSON.stringify(activeCategory)}, ${JSON.stringify(fetchData)})`
  //       } catch {
  //         return `initOverlays()`
  //       }
  //     } else {
  //       memorize = 'initOverlays()'
  //       return 'initOverlays()'
  //     }
  //   }

  //   const prev = memorize ? memorize : 'initOverlays()'
  //   const current = await changeScripts()

  //   return { prev, current }
  // }

  // useEffect(() => {
  //   (async () => {
  //     if (webViewRef.current) {
  //       const item = await handleBoundsChanged()
  //       // const script = `
  //       //   kakao.maps.event.removeListener(map, 'bounds_changed', ${item.prev})
  //       //   ${item.current}
  //       //   kakao.maps.event.addListener(map, 'bounds_changed', ${item.current})
  //       // `

  //       if(item) {
  //         const script = `
  //           ${item.current}
  //         `
  //         webViewRef.current.injectJavaScript(script)
  //       }
  //     }
  //   })()
  // }, [activeCategory, eyeState, location, refreshed])

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
  if (webViewRef.current) {
    webViewRef.current.injectJavaScript(`showTrfficInfo(${JSON.stringify(isTrafficPressed)})`)
  }

  const initFn = `
    kakao.maps.load(function(){
      createMap(${JSON.stringify(location)})

      document.addEventListener('click', function(event) {
        if (event.target.classList.contains('customoverlay')) {
          const dataKey = event.target.getAttribute('data-key')
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'overlayClicked', data: dataKey }))
        }
      })

      kakao.maps.event.addListener(map, 'zoom_changed', function(event) {
        const data = 'LEVEL_' + map.getLevel()

        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'zoomChanged', data: data }))
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
        // const eventData = JSON.parse(event.nativeEvent.data)
        // setZoomLevel(eventData.data)
      }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
    />
  )
}

export default MapView
