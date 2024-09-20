import { View, TouchableOpacity, ScrollView } from 'react-native'

import { SafeScreen } from '@/components/common'
import {
  NextButton,
  OnBoardingContent,
  OnBoardingProvider,
  useOnBoardingContext,
} from '@/components/onboarding'
import { Typo } from '@/shared'

export default function OnBoardingScreen() {
  return (
    <SafeScreen excludeEdges={['bottom']}>
      <OnBoardingProvider>
        <View className="flex-1">
          <View className="flex-row items-center justify-end px-5 py-2">
            <SkipButton />
          </View>

          <View className="flex-1 justify-between">
            <ScrollView className="flex-1 px-6">
              <View className="pt-8">
                <Typo className="mb-2 font-Bold text-3xl text-gray-800">
                  어떤 여행에{'\n'}관심이 있으세요?
                </Typo>
                <Typo className="mb-8 text-base text-gray-500">관심 여행지를 모두 골라주세요.</Typo>

                <OnBoardingContent />
              </View>
            </ScrollView>
            <NextButton />
          </View>
        </View>
      </OnBoardingProvider>
    </SafeScreen>
  )
}

function SkipButton() {
  const { handleSkip } = useOnBoardingContext()
  return (
    <TouchableOpacity onPress={handleSkip}>
      <Typo className="font-Light text-sm text-gray-500 underline">건너뛰기</Typo>
    </TouchableOpacity>
  )
}
