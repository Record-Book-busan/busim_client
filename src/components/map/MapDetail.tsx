import { useEffect, useRef, useState } from 'react'
import WebView from 'react-native-webview'

import { useLocation } from '@/hooks/useLocation'
import map from '@/services/map/map'

type MapDetailProps = {
  geometry?: {
    lon: number
    lat: number
  }
}

function MapDetail(props: MapDetailProps) {
  const webViewRef = useRef<WebView>(null)

  const [position, setPosition] = useState<MapDetailProps>()
  const { location, refreshLocation } = useLocation()

  useEffect(() => {
    const setMap = async () => {
      if (!props.geometry) {
        await refreshLocation()

        setPosition({
          geometry: {
            lat: location.lat,
            lon: location.lng,
          },
        })
      } else {
        setPosition({
          geometry: {
            lat: props.geometry.lat,
            lon: props.geometry.lon,
          },
        })
      }
    }

    void setMap()
  }, [])

  useEffect(() => {
    if (position && webViewRef.current) {
      const initFn = `
        kakao.maps.load(function(){ 
          const container = document.getElementById('map');
          const options = {
              center: new kakao.maps.LatLng(${position.geometry?.lat}, ${position.geometry?.lon}),
              level: 3
          };
          
          const map = new kakao.maps.Map(container, options)

          const marker = new kakao.maps.Marker({
              position: new kakao.maps.LatLng(${position.geometry?.lat}, ${position.geometry?.lon})
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
    />
  )
}

export default MapDetail
