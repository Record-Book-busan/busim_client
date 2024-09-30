import { View } from 'react-native'

import { RecordMapView } from '../map'

export function Place() {
  return (
    <View className="flex-1">
      {/* 지도 웹뷰 */}
      <View className="flex-1">
        <RecordMapView />
      </View>
    </View>
  )
}
