import { useNavigation } from '@react-navigation/native'
import { View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { SafeScreen } from '@/components/common'
import { Button, SvgIcon, Typo } from '@/shared'
import { RootStackParamList } from '@/types/navigation'

import type { StackNavigationProp } from '@react-navigation/stack'

export default function ErrorScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Error'>>()

  return (
    <SafeScreen excludeEdges={['bottom']} statusBarColor={'#f3c5c1'} textColor={'light-content'}>
      <LinearGradient
        className="flex w-full flex-1 items-center justify-start"
        colors={['#f3c5c1', '#fcf5f4', '#FFFFFF']}
      >
        <View className="items-center justify-center gap-2">
          <SvgIcon name="seagull" />
          <Typo className="text-lg font-bold">시스템 오류가 발생했습니다.</Typo>
          <Typo className="text-base font-bold">잠시 후 다시 시도해주세요.</Typo>
        </View>
        <View className="absolute top-3/4 flex-1">
          <Button
            type="button"
            className="rounded-full bg-[#eca39d] px-4 py-2"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            hoverColor="#eca39d"
            onPress={() => navigation.goBack()}
          >
            <Typo className="text-white">다시 시도하기</Typo>
          </Button>
        </View>
      </LinearGradient>
    </SafeScreen>
  )
}
