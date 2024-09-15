import { useMemo } from 'react'
import WebView from 'react-native-webview'

const KAKAO_SDK_URL = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KakaoJsApiKey}`

interface MapDetailProps {
  geometry: {
    lon: number
    lat: number
  }
  /** 장소명 */
  title?: string
}

function MapDetail({ geometry, title }: MapDetailProps) {
  const { lat, lon } = geometry

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
            var content = '<div class="custom-overlay">' +
                            '<span class="label">${title}</span>' +
                          '</div>';
            var customOverlay = new kakao.maps.CustomOverlay({
              map: map,
              position: markerPosition,
              content: content,
              yAnchor: 1 
            });
            map.setDraggable(false);
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
      onError={syntheticEvent => {
        const { nativeEvent } = syntheticEvent
        console.error('[ERROR] WebView 에러: ', nativeEvent)
      }}
    />
  )
}

export default MapDetail
