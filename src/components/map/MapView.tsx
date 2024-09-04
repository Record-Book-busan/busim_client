import { useEffect } from 'react'
import { WebView } from 'react-native-webview'

import { map } from '@/services/map/map'

function MapView() {
  useEffect(() => {
    console.log(map)
  }, [])

  return <WebView source={{ html: map }} />
}
export default MapView
