import { WebView } from 'react-native-webview'

import { map } from '@/services/map/map'

function MapView() {
  return <WebView source={{ html: map }} />
}
export default MapView
