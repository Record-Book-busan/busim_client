import { useState } from 'react'
import { View } from 'react-native'

import { KeyboardDismissPressable, SafeScreen, SearchBar } from '@/components/common'
import { Feed, Place } from '@/components/record'
import { Tab, TabView } from '@/shared'

export default function RecordMainScreen() {
  const [index, setIndex] = useState(0)

  return (
    <SafeScreen excludeEdges={['top']}>
      <KeyboardDismissPressable>
        <View className="flex-1 bg-white">
          <View className="bg-white shadow">
            <SearchBar type="default" />
            <Tab value={index} onValueChange={setIndex}>
              <Tab.Item>장소 기록</Tab.Item>
              <Tab.Item>기록 피드</Tab.Item>
            </Tab>
          </View>
          <TabView value={index} onValueChange={setIndex}>
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
