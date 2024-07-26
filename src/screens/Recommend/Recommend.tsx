import { Text, View } from 'react-native'

import AppBar from '@/components/template/AppBar/AppBar'
import { SafeScreen } from '@/shared'

function Recommend() {
  return (
    <View className="height bg-white/30 backdrop-blur">
      <SafeScreen>
        <AppBar />
        <Text>추천</Text>
        <Text>추천</Text>
        <Text>추천</Text>
        <Text>추천</Text>

        {/* <MapView /> */}
      </SafeScreen>
    </View>
  )
}

export default Recommend
