import { useNavigation } from '@react-navigation/native'
import React, { createContext, useContext, useState } from 'react'
import { useSharedValue, withTiming, runOnJS, type SharedValue } from 'react-native-reanimated'

import { CATEGORY, CategoryType } from '@/constants'
import { navigateWithPermissionCheck } from '@/hooks/useNavigationPermissionCheck'
import { INTEREST_KEY, storage } from '@/utils/storage'

import type { RootStackParamList } from '@/types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'

type OnBoardingContextProps = {
  currentScreen: 'tour' | 'food'
  isAnimating: boolean
  handleSkip: () => void
  handleNext: () => void
  animationProgress: SharedValue<number>
  toggleSelection: (id: string, screenType: 'tour' | 'food') => void
  tourSelections: Selection[]
  foodSelections: Selection[]
}

type Selection = {
  id: CategoryType
  title: string
  icon: string
  isSelected: boolean
  description?: string
}

const OnBoardingContext = createContext<OnBoardingContextProps | undefined>(undefined)

export const OnBoardingProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentScreen, setCurrentScreen] = useState<'tour' | 'food'>('tour')
  const [isAnimating, setIsAnimating] = useState(false)
  const animationProgress = useSharedValue(0)
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'MainTab'>>()

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
    navigateWithPermissionCheck({
      navigation,
      routeName: 'MainTab',
      params: {
        screen: 'Map',
        params: { categories: [] },
      },
    })
  }

  const getCheckedCategories = (): CategoryType[] => {
    const categories: CategoryType[] = []

    tourSelections.forEach(t => {
      if (t.isSelected) categories.push(t.id)
    })

    foodSelections.forEach(f => {
      if (f.isSelected) categories.push(f.id)
    })

    return categories
  }

  const handleNext = () => {
    if (currentScreen === 'tour' && !isAnimating) {
      setIsAnimating(true)
      animationProgress.value = withTiming(1, { duration: 200 }, () => {
        runOnJS(setCurrentScreen)('food')
        runOnJS(setIsAnimating)(false)
      })
    } else {
      storage.set(INTEREST_KEY, JSON.stringify(getCheckedCategories()))

      navigation.replace('MainTab', {
        screen: 'Map',
        params: { categories: getCheckedCategories() },
      })
    }
  }

  return (
    <OnBoardingContext.Provider
      value={{
        currentScreen,
        isAnimating,
        handleSkip,
        handleNext,
        animationProgress,
        toggleSelection,
        tourSelections,
        foodSelections,
      }}
    >
      {children}
    </OnBoardingContext.Provider>
  )
}

export const useOnBoardingContext = () => {
  const context = useContext(OnBoardingContext)

  if (!context) {
    throw new Error('초기화 실패')
  }
  return context
}
