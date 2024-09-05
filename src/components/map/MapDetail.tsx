import { useRef } from 'react'
import WebView from 'react-native-webview'

import map from '@/services/map/map'

type MapDetailProps = {
  geometry: {
    lon: number
    lat: number
  }
}

function MapDetail(props: MapDetailProps) {
  const webViewRef = useRef(null)

  const initFn = `
    kakao.maps.load(function(){ 
      let map;

      const container = document.getElementById('map');
      const options = {
          center: new kakao.maps.LatLng(${props.geometry.lat}, ${props.geometry.lon}),
          level: 3
      };
      
      map = new kakao.maps.Map(container, options)

      const marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(${props.geometry.lat}, ${props.geometry.lon})
      });

      marker.setMap(map);
      map.setDraggable(false);
    })
  `

  return (
    <WebView
      ref={webViewRef}
      source={{ html: map }}
      injectedJavaScript={initFn}
      onLoad={() => {
        if (webViewRef.current) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          ;(webViewRef.current as any).injectJavaScript(initFn)
        }
      }}
    />
  )
}

export default MapDetail
