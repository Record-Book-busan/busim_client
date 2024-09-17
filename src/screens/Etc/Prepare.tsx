import { View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { SafeScreen } from '@/components/common'
import { SvgIcon, Typo } from '@/shared'

export default function PrepareScreen() {
  return (
    <SafeScreen excludeEdges={['bottom']} statusBarColor={'#5e7dc0'} textColor={'light-content'}>
      <LinearGradient
        className="flex w-full flex-1 items-center justify-start"
        colors={['#5e7dc0', '#bac8e4', '#FFFFFF']}
      >
        <View className="items-center justify-center gap-2">
          <SvgIcon name="seagull" />
          <Typo className="text-lg font-bold">끼록부는 지금</Typo>
          <Typo className="py-2 text-6xl font-bold">준비 중</Typo>
        </View>
      </LinearGradient>
    </SafeScreen>
  )
}
