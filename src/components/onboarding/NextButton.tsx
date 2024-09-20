import { TouchableOpacity, View } from 'react-native'

import { Typo } from '@/shared'

import { useOnBoardingContext } from './hooks/useOnBoardingContext'

export function NextButton() {
  const { currentScreen, handleNext } = useOnBoardingContext()

  return (
    <View className="items-center justify-center">
      <View className="mb-4 mt-3 w-3/4">
        <TouchableOpacity
          className="mb-3 w-full rounded-full bg-BUSIM-blue-dark py-3.5"
          onPress={handleNext}
        >
          <Typo className="text-center font-SemiBold text-lg text-white">
            {currentScreen === 'tour' ? '다음' : '완료'}
          </Typo>
        </TouchableOpacity>
        <Typo className="text-center text-xs text-gray-500">
          관심 여행지는 나중에 다시 수정할 수 있어요!
        </Typo>
      </View>
    </View>
  )
}
