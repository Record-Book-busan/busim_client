import { type NavigationProp, useNavigation } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { SafeScreen } from '@/components/common'

import type { RootStackParamList } from '@/types/navigation'

type SelectionsProps = {
  title: string
  isSelected: boolean
  onPress: () => void
}

const Selections = React.memo(({ title, isSelected, onPress }: SelectionsProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={
      'my-1 w-full flex-row justify-center rounded-2xl border border-[#DBDCE5] bg-white py-4'
    }
    style={isSelected ? { borderColor: '#2653B0', backgroundColor: 'rgba(38,83,176,0.15)' } : {}}
  >
    <Text className="text-base font-bold text-gray-700">{title}</Text>
  </TouchableOpacity>
))

function InterestTourScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'InterestStack'>>()

  const [first, setFirst] = useState(false)
  const [second, setSecond] = useState(false)
  const [third, setThird] = useState(false)
  const [fourth, setFourth] = useState(false)
  const [fifty, setFifty] = useState(false)

  const handleFirstPress = useCallback(() => setFirst(prev => !prev), [])
  const handleSecondPress = useCallback(() => setSecond(prev => !prev), [])
  const handleThirdPress = useCallback(() => setThird(prev => !prev), [])
  const handleFourthPress = useCallback(() => setFourth(prev => !prev), [])
  const handleFiftyPress = useCallback(() => setFifty(prev => !prev), [])

  const selections = [
    { title: '🏖 관광지', isSelected: first, onPress: handleFirstPress },
    { title: '🎡 테마', isSelected: second, onPress: handleSecondPress },
    { title: '🔥 핫플', isSelected: third, onPress: handleThirdPress },
    { title: '🌴 자연', isSelected: fourth, onPress: handleFourthPress },
    { title: '🤿 레포츠', isSelected: fifty, onPress: handleFiftyPress },
  ]

  const moveInterestFoodHandler = () => {
    navigation.navigate('InterestStack', {
      screen: 'InterestFood',
      params: selections.map(({ title, isSelected }) => ({ title, isSelected })),
    })
  }

  return (
    <SafeScreen>
      <View className="px-4">
        <Text className="text-2xl font-bold">어떤 여행에{'\n'}관심이 있으세요?</Text>
        <Text className="color-[#ECA39D] py-2 text-sm">관심 여행지를 모두 골라주세요.</Text>
        <View className="jusitfy-center my-8 flex w-full items-center">
          <Text className="py-4 text-center text-xl font-bold">관광지도</Text>
          {selections.map((item, index) => (
            <Selections key={index} {...item} />
          ))}
        </View>
      </View>
      <View className="flex w-full items-center">
        <TouchableOpacity
          className="flex h-10 w-32 justify-center rounded-2xl bg-[#2653B0]"
          onPress={moveInterestFoodHandler}
        >
          <Text className="text-center text-sm text-white">계속하기</Text>
        </TouchableOpacity>
        <Text className="py-4 text-center text-sm text-[#96979E]">
          관심 여행지는 나중에 다시 수정할 수 있어요!
        </Text>
      </View>
    </SafeScreen>
  )
}

export default InterestTourScreen
