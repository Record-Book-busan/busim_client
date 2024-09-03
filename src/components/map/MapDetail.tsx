import WebView from 'react-native-webview'

import { detail } from '@/services/map/map'

type MapDetailProps = {
  geometry: {
    lon: number
    lat: number
  }
}

function MapDetail(props: MapDetailProps) {
  return <WebView source={{ html: detail(props.geometry) }} />
}

export default MapDetail
