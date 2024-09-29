import { View } from 'react-native'

import { Button, Typo } from '@/shared'

import { useOnBoardingContext } from './hooks/useOnBoardingContext'

export function NextButton() {
  const { currentScreen, handleNext } = useOnBoardingContext()

  return (
    <View className="items-center justify-center">
      <View className="mb-8 mt-3 w-3/4">
        <View className="pb-2">
          <Button variant="primary" type="button" size="full" onPress={handleNext}>
            <Typo className="text-center font-SemiBold text-lg text-white">
              {currentScreen === 'tour' ? '다음' : '완료'}
            </Typo>
          </Button>
        </View>
        <Typo className="text-center text-xs text-gray-500">
          관심 여행지는 나중에 다시 수정할 수 있어요!
        </Typo>
      </View>
    </View>
  )
}
