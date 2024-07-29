import { View } from 'react-native'

import { MapView } from '@/components/map'
import { SearchHeader } from '@/shared'

function MapScreen() {
  return (
    <View className="flex-1">
      <SearchHeader />
      <MapView />
    </View>
  )
}

export default MapScreen
