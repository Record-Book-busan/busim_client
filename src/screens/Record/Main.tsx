import { type NavigationProp, useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { View } from 'react-native'

import { KeyboardDismissPressable, SafeScreen, SearchBarView } from '@/components/common'
import { Feed, Place } from '@/components/record'
import { Tab, TabView } from '@/shared'
import { RootStackParamList } from '@/types/navigation'

export default function RecordMainScreen() {
  const [index, setIndex] = useState(0)
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'MainTab'>>()

  const handleSearchBarPress = () =>
    navigation.navigate('SearchStack', {
      screen: 'Search',
    })

  return (
    <SafeScreen>
      <KeyboardDismissPressable>
        <SearchBarView placeholder="장소 검색" onPress={handleSearchBarPress} />
        <View className="flex-1 bg-white">
          <View className="bg-white pt-2">
            <Tab value={index} onValueChange={setIndex}>
              <Tab.Item>장소 기록</Tab.Item>
              <Tab.Item>기록 피드</Tab.Item>
            </Tab>
          </View>
          <TabView disableSwipe={true} value={index} onValueChange={setIndex}>
            <TabView.Item>
              <Place />
            </TabView.Item>
            <TabView.Item>
              <Feed />
            </TabView.Item>
          </TabView>
        </View>
      </KeyboardDismissPressable>
    </SafeScreen>
  )
}
