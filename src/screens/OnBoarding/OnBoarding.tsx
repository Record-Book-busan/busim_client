import { type BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated'

import { SafeScreen } from '@/components/common'
import { CATEGORY, CategoryType, window } from '@/constants'
import { SvgIcon, Typo } from '@/shared'

import type { RootStackParamList } from '@/types/navigation'

const SCREEN_WIDTH = window.width

type Selection = {
  id: CategoryType
  title: string
  icon: string
  isSelected: boolean
  description?: string
}

export default function OnBoardingScreen() {
  const [currentScreen, setCurrentScreen] = useState<'tour' | 'food'>('tour')
  const [isAnimating, setIsAnimating] = useState(false)
  const progress = useSharedValue(0)
  const navigation = useNavigation<BottomTabNavigationProp<RootStackParamList, 'MainTab'>>()

  const [tourSelections, setTourSelections] = useState<Selection[]>([
    { id: CATEGORY.관광지, title: '관광지', icon: '🏖', isSelected: false },
    { id: CATEGORY.테마, title: '테마', icon: '🎡', isSelected: false },
    { id: CATEGORY.핫플, title: '핫플', icon: '🔥', isSelected: false },
    { id: CATEGORY.자연, title: '자연', icon: '🌴', isSelected: false },
    { id: CATEGORY.레포츠, title: '레포츠', icon: '🤿', isSelected: false },
  ])

  const [foodSelections, setFoodSelections] = useState<Selection[]>([
    {
      id: CATEGORY.특별한_맛집,
      title: '특별한 맛집',
      icon: '🍽',
      isSelected: false,
      description: '공무원 맛집, 블루 리본 맛집, 오션뷰 맛집 등 특별한 맛집에 대해서 추천드려요.',
    },
    {
      id: CATEGORY.맛집,
      title: '일반 맛집',
      icon: '☕',
      isSelected: false,
      description: '부산 시내 전역에 있는 맛집들을 추천해드려요',
    },
  ])

  const toggleSelection = (id: string, screenType: 'tour' | 'food') => {
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
    navigation.navigate('MainTab', {
      screen: 'Map',
      params: { categories: [] },
    })
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

  const getCheckedCategories = (): CategoryType[] => {
    const categories: CategoryType[] = []

    tourSelections.map(t => {
      if (t.isSelected) categories.push(t.id)
    })

    foodSelections.map(f => {
      if (f.isSelected) categories.push(f.id)
    })

    console.log(categories)

    return categories
  }

  const handleNext = () => {
    if (currentScreen === 'tour' && !isAnimating) {
      setIsAnimating(true)
      progress.value = withTiming(1, { duration: 170 }, () => {
        runOnJS(setCurrentScreen)('food')
        runOnJS(setIsAnimating)(false)
      })
    } else {
      navigation.navigate('MainTab', {
        screen: 'Map',
        params: { categories: getCheckedCategories() },
      })
    }
  }

  return (
    <SafeScreen excludeEdges={['bottom']}>
      <View className="flex-1">
        {/* 헤더  영역 */}
        <View className="flex-row items-center justify-end px-5 py-2">
          <TouchableOpacity onPress={handleSkip}>
            <Typo className="font-Light text-sm text-gray-500 underline">건너뛰기</Typo>
          </TouchableOpacity>
        </View>

        <View className="flex-1 px-6">
          <View className="pt-8">
            <Typo className="mb-2 font-Bold text-3xl text-gray-800">
              어떤 여행에{'\n'}관심이 있으세요?
            </Typo>
            <Typo className="mb-8 text-base text-gray-500">관심 여행지를 모두 골라주세요.</Typo>

            {/* 관광지도 관심사 선택 */}
            <View className="relative h-full">
              <Animated.View style={[{ position: 'absolute', width: '100%' }, animatedStyleTour]}>
                <Typo className="mb-4 font-Medium text-xl text-gray-700">관광지도</Typo>
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
                <Typo className="mb-4 font-Medium text-xl text-gray-700">맛집지도</Typo>
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
            <View className="h-32" />
          </View>
        </View>
        <View className="absolute bottom-3 left-0 right-0 w-full items-center p-6">
          <TouchableOpacity
            className="mb-3 w-2/3 rounded-full bg-BUSIM-blue-dark py-3.5"
            onPress={handleNext}
          >
            <Typo className="text-center font-SemiBold text-lg text-white">계속하기</Typo>
          </TouchableOpacity>
          <Typo className="text-center text-xs text-gray-500">
            관심 여행지는 나중에 다시 수정할 수 있어요!
          </Typo>
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
      className={`mb-3 w-full rounded-2xl ${isSelected ? 'border-blue-600 bg-BUSIM-blue-light' : 'border-gray-200 bg-white'} border p-4`}
    >
      <View className="flex-row items-center justify-center">
        <Typo className="mr-2 text-2xl">{icon}</Typo>
        <Typo
          className={`mr-2 font-SemiBold text-lg ${isSelected ? 'text-BUSIM-blue' : 'text-gray-800'}`}
        >
          {title}
        </Typo>
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
        <Typo className="text-sm text-[#96979E]">
          <Typo className="font-Medium text-[#6B6D75]">{title}</Typo>이란?
        </Typo>
        <Typo className="font-Light text-sm text-[#96979E]">{description}</Typo>
      </View>
    </View>
  )
}
