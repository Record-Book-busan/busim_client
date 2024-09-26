import { useMemo } from 'react'
import WebView, { type WebViewMessageEvent } from 'react-native-webview'

const KAKAO_SDK_URL = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KakaoJsApiKey}`

interface Geometry {
  lat: number
  lng: number
}
interface MapDetailProps {
  geometry: {
    lon: number
    lat: number
  }
  onCenterChange?: ({ lat, lng }: Geometry) => void
  /** 장소명 */
  title?: string
}

type ReturnProps = {
  type: string
  data: {
    zoomLevel: string
    lat: number
    lng: number
    type: string
    id: number
  }
}

function MapDetail({ geometry, title, onCenterChange }: MapDetailProps) {
  const { lat, lon } = geometry

  const handleMessage = (event: WebViewMessageEvent) => {
    const eventData: ReturnProps = JSON.parse(event.nativeEvent.data)

    if (!!onCenterChange && eventData.type === 'dragend') {
      onCenterChange({ lat: eventData.data.lat, lng: eventData.data.lng })
    }
  }

  const htmlContent = useMemo(
    () => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body, html { margin: 0; padding: 0; height: 100%; }
          #map { width: 100%; height: 100%; }
          .custom-overlay {
            position: relative;
            bottom: -23px;
            border-radius: 6px;
            float: left;
            text-align: center;
          }
          .custom-overlay .label {
            display: inline-block;
            font-size: 13px;
            font-weight: 500;
            letter-spacing: -0.05em;
            text-shadow: -1px 0px white, 0px 1px white, 1px 0px white, 0px -1px white;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="${KAKAO_SDK_URL}"></script>
        <script>
          function initMap() {
            var container = document.getElementById('map');
            var options = {
              center: new kakao.maps.LatLng(${lat}, ${lon}),
              level: 3
            };
            var map = new kakao.maps.Map(container, options);
            var markerPosition = new kakao.maps.LatLng(${lat}, ${lon});
            var marker = new kakao.maps.Marker({
              position: new kakao.maps.LatLng(${lat}, ${lon})
            });
            marker.setMap(map);
            ${
              !!title &&
              `
              var content = '<div class="custom-overlay">' +
                              '<span class="label">${title}</span>' +
                            '</div>';
              var customOverlay = new kakao.maps.CustomOverlay({
                map: map,
                position: markerPosition,
                content: content,
                yAnchor: 1 
              });
            `
            }
            
            ${!onCenterChange && 'map.setDraggable(false);'}

            kakao.maps.event.addListener(map, 'dragend', function() {
                const data = map.getCenter();
                marker.setPosition(data);
                ${!!title && 'customOverlay.setPosition(data);'}
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'dragend', data: { lat: data.getLat(), lng: data.getLng() } }));
            });
          }
          kakao.maps.load(initMap);
        </script>
      </body>
    </html>
  `,
    [title, lat, lon],
  )

  return (
    <WebView
      source={{ html: htmlContent }}
      style={{ flex: 1 }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      onMessage={handleMessage}
      onError={syntheticEvent => {
        const { nativeEvent } = syntheticEvent
        console.error('[ERROR] WebView 에러: ', nativeEvent)
      }}
    />
  )
}

export default MapDetail
