import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { View } from 'react-native'

import { SafeScreen, SearchHeader } from '@/components/common'
import { Place } from '@/components/record'
import { FeedMain } from '@/components/record/FeedMain'
import { useNavigateWithPermissionCheck } from '@/hooks/useNavigationPermissionCheck'
import { Tab, TabView } from '@/shared'

import type { RecordStackParamList } from '@/types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'

export default function RecordMainScreen() {
  const [index, setIndex] = useState(0)
  const navigation = useNavigation<StackNavigationProp<RecordStackParamList, 'RecordMain'>>()
  const { navigateWithPermissionCheck } = useNavigateWithPermissionCheck()

  const handleSearchBarPress = () =>
    navigateWithPermissionCheck({
      navigation,
      routeName: 'RecordSearch',
    })

  return (
    <SafeScreen excludeEdges={['bottom']}>
      {/* 검색바 */}
      <SearchHeader type="button" placeholder="장소 검색" onPress={handleSearchBarPress} />
      <View className="flex-1 bg-white">
        <Tab
          value={index}
          onValueChange={setIndex}
          containerStyle="border-b-2 border-gray-200 bg-white pt-2"
        >
          <Tab.Item>장소 기록</Tab.Item>
          <Tab.Item>기록 피드</Tab.Item>
        </Tab>

        <TabView disableSwipe={true} value={index} onValueChange={setIndex}>
          <TabView.Item>
            <Place />
          </TabView.Item>
          <TabView.Item>
            <FeedMain />
          </TabView.Item>
        </TabView>
      </View>
    </SafeScreen>
  )
}
