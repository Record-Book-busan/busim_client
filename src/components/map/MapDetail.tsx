import { useEffect, useMemo, useRef } from 'react'
import WebView from 'react-native-webview'

import map from '@/services/map/map'

type MapDetailProps = {
  geometry: {
    lon: number
    lat: number
  }
}

function MapDetail(props: MapDetailProps) {
  const webViewRef = useRef<WebView>(null)

  const position = useMemo(
    () => ({
      lat: props.geometry.lat,
      lon: props.geometry.lon,
    }),
    [props.geometry.lat, props.geometry.lon],
  )

  useEffect(() => {
    if (webViewRef.current) {
      const initFn = `
        kakao.maps.load(function(){ 
          const container = document.getElementById('map');
          const options = {
              center: new kakao.maps.LatLng(${position.lat}, ${position.lon}),
              level: 3
          };
          
          const map = new kakao.maps.Map(container, options);

          const marker = new kakao.maps.Marker({
              position: new kakao.maps.LatLng(${position.lat}, ${position.lon})
          });

          marker.setMap(map);
          map.setDraggable(false);
        });
      `

      webViewRef.current.injectJavaScript(initFn)
    }
  }, [position])

  return (
    <WebView
      ref={webViewRef}
      source={{ html: map }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
    />
  )
}

export default MapDetail
