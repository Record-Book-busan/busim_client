import { useNavigation, type NavigationProp } from '@react-navigation/native'
import { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated'

import { SafeScreen } from '@/components/common'
import { window } from '@/constants'
import { Button, SvgIcon } from '@/shared'

import type { RootStackParamList } from '@/types/navigation'

const SCREEN_WIDTH = window.width

type Selection = {
  id: number
  title: string
  icon: string
  isSelected: boolean
  description?: string
}

// TODO: 애니메이션 안정성 검사해야함
// FIXME: onPress 가끔 씹히는 버그 해결해야함
export default function OnBoardingScreen() {
  const [currentScreen, setCurrentScreen] = useState<'tour' | 'food'>('tour')
  const [isAnimating, setIsAnimating] = useState(false)
  const progress = useSharedValue(0)
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'MainTab'>>()

  const [tourSelections, setTourSelections] = useState<Selection[]>([
    { id: 1, title: '관광지', icon: '🏖', isSelected: false },
    { id: 2, title: '테마', icon: '🎡', isSelected: false },
    { id: 3, title: '핫플', icon: '🔥', isSelected: false },
    { id: 4, title: '자연', icon: '🌴', isSelected: false },
    { id: 5, title: '레포츠', icon: '🤿', isSelected: false },
  ])

  const [foodSelections, setFoodSelections] = useState<Selection[]>([
    {
      id: 10,
      title: '특별한 맛집',
      icon: '🍽',
      isSelected: false,
      description: '공무원 맛집, 블루 리본 맛집, 오션뷰 맛집 등 특별한 맛집에 대해서 추천드려요.',
    },
    {
      id: 11,
      title: '일반 맛집',
      icon: '☕',
      isSelected: false,
      description: '부산 시내 전역에 있는 맛집들을 추천해드려요',
    },
  ])

  const toggleSelection = (id: number, screenType: 'tour' | 'food') => {
    console.log(screenType, '클릭된 id:', id)
    if (screenType === 'tour') {
      setTourSelections(prev =>
        prev.map(item => (item.id === id ? { ...item, isSelected: !item.isSelected } : item)),
      )
    } else {
      setFoodSelections(prev =>
        prev.map(item => (item.id === id ? { ...item, isSelected: !item.isSelected } : item)),
      )
    }
  }

  const handleSkip = () => {
    navigation.navigate('MainTab', { screen: 'Map' })
  }

  const animatedStyleTour = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(-progress.value * SCREEN_WIDTH, {
          duration: 170,
          easing: Easing.inOut(Easing.ease),
        }),
      },
    ],
    opacity: withTiming(1 - progress.value, { duration: 500 }),
    zIndex: progress.value === 0 ? 1 : 0,
  }))

  const animatedStyleFood = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming((1 - progress.value) * SCREEN_WIDTH, {
          duration: 170,
          easing: Easing.inOut(Easing.ease),
        }),
      },
    ],
    opacity: withTiming(progress.value, { duration: 500 }),
    zIndex: progress.value === 1 ? 1 : 0,
  }))

  const handleNext = () => {
    if (currentScreen === 'tour' && !isAnimating) {
      setIsAnimating(true)
      progress.value = withTiming(1, { duration: 170 }, () => {
        runOnJS(setCurrentScreen)('food')
        runOnJS(setIsAnimating)(false)
      })
    } else {
      navigation.navigate('MainTab', { screen: 'Map' })
    }
  }

  const handleBack = () => {
    if (currentScreen === 'food' && !isAnimating) {
      setIsAnimating(true)
      progress.value = withTiming(0, { duration: 170 }, () => {
        runOnJS(setCurrentScreen)('tour')
        runOnJS(setIsAnimating)(false)
      })
    } else {
      navigation.goBack()
    }
  }

  return (
    <SafeScreen excludeEdges={['bottom']}>
      <View className="flex-1">
        {/* 헤더  영역 */}
        <View className="flex-row items-center justify-between px-3 py-2">
          <Button type="touch" onPress={handleBack}>
            <SvgIcon name="chevronLeft" width={18} height={18} />
          </Button>
          <TouchableOpacity onPress={handleSkip}>
            <Text className="text-sm text-gray-500 underline">건너뛰기</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 px-6">
          <View className="pt-8">
            <Text className="mb-2 text-3xl font-bold text-gray-800">
              어떤 여행에{'\n'}관심이 있으세요?
            </Text>
            <Text className="mb-8 text-base text-gray-500">관심 여행지를 모두 골라주세요.</Text>

            {/* 관광지도 관심사 선택 */}
            <View className="relative h-full">
              <Animated.View style={[{ position: 'absolute', width: '100%' }, animatedStyleTour]}>
                <Text className="mb-4 text-xl font-semibold text-gray-700">관광지도</Text>
                {tourSelections.map(item => (
                  <Selection
                    key={item.id}
                    {...item}
                    onPress={() => !isAnimating && toggleSelection(item.id, 'tour')}
                  />
                ))}
              </Animated.View>

              {/* 맛집지도 관심사 선택 */}
              <Animated.View style={[{ position: 'absolute', width: '100%' }, animatedStyleFood]}>
                <Text className="mb-4 text-xl font-semibold text-gray-700">맛집지도</Text>
                {foodSelections.map(item => (
                  <View key={item.id} className="mb-4">
                    <Selection
                      {...item}
                      onPress={() => !isAnimating && toggleSelection(item.id, 'food')}
                    />
                    {item.description && (
                      <QuestionSection title={item.title} description={item.description} />
                    )}
                  </View>
                ))}
              </Animated.View>
            </View>
          </View>
          <View className="h-32" />
        </View>

        <View className="absolute bottom-3 w-full items-center px-6 pb-6 pt-4">
          <TouchableOpacity
            className="mb-3 w-2/3 rounded-full bg-blue-800 py-4"
            onPress={handleNext}
          >
            <Text className="text-center text-lg font-bold text-white">
              {currentScreen === 'tour' ? '다음' : '완료'}
            </Text>
          </TouchableOpacity>
          <Text className="text-center text-sm text-gray-500">
            관심 여행지는 나중에 다시 수정할 수 있어요!
          </Text>
        </View>
      </View>
    </SafeScreen>
  )
}

type SelectionProps = {
  title: string
  icon: string
  isSelected: boolean
  onPress: () => void
}

function Selection({ title, icon, isSelected, onPress }: SelectionProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`mb-3 w-full rounded-2xl ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'} border p-4`}
    >
      <View className="flex-row items-center">
        <Text className="mr-2 text-2xl">{icon}</Text>
        <Text className={`text-lg ${isSelected ? 'font-bold text-blue-700' : 'text-gray-700'}`}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

type QuestionSectionProps = {
  title: string
  description: string
}

function QuestionSection({ title, description }: QuestionSectionProps) {
  return (
    <View className="mt-2 flex-row">
      <View className="mt-1 shadow">
        <SvgIcon name="question" />
      </View>
      <View className="ml-2 flex-1">
        <Text className="text-sm text-gray-500">
          <Text className="font-semibold">{title}</Text>이란?
        </Text>
        <Text className="text-sm font-light text-gray-500">{description}</Text>
      </View>
    </View>
  )
}
