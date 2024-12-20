import { type RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { Suspense, useEffect, useState } from 'react'
import { View } from 'react-native'

import { SafeScreen, SearchHeader } from '@/components/common'
import { Place } from '@/components/record'
import { FeedMain } from '@/components/record/FeedMain'
import { Tab, TabView, Typo } from '@/shared'

import type { RecordStackParamList } from '@/types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'

export default function RecordMainScreen() {
  const [index, setIndex] = useState(0)
  const navigation = useNavigation<StackNavigationProp<RecordStackParamList, 'RecordMain'>>()
  const route = useRoute<RouteProp<RecordStackParamList, 'RecordMain'>>()

  useEffect(() => {
    if (route.params?.tab) {
      setIndex(route.params.tab)
    }
  }, [route.params?.tab])

  const handleSearchBarPress = () => navigation.navigate('RecordSearch')

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
            {index === 0 && (
              <Suspense fallback={<Typo>로딩중,,</Typo>}>
                <Place />
              </Suspense>
            )}
          </TabView.Item>
          <TabView.Item>
            {index === 1 && (
              <Suspense fallback={<Typo>로딩중..</Typo>}>
                <FeedMain />
              </Suspense>
            )}
          </TabView.Item>
        </TabView>
      </View>
    </SafeScreen>
  )
}
