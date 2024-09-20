import { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import Animated, { useAnimatedStyle, useDerivedValue } from 'react-native-reanimated'

import { window } from '@/constants'
import { SvgIcon, Typo } from '@/shared'

import { useOnBoardingContext } from './hooks/useOnBoardingContext'

const SCREEN_WIDTH = window.width

export function OnBoardingContent() {
  const { isAnimating, toggleSelection, tourSelections, foodSelections, animationProgress } =
    useOnBoardingContext()
  const [containerHeight, setContainerHeight] = useState(0)

  const tourAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - animationProgress.value,
    transform: [{ translateX: -animationProgress.value * SCREEN_WIDTH }],
  }))

  const foodAnimatedStyle = useAnimatedStyle(() => ({
    opacity: animationProgress.value,
    transform: [{ translateX: SCREEN_WIDTH * (1 - animationProgress.value) }],
  }))

  const tourPointerEvents = useDerivedValue(() => (animationProgress.value < 0.5 ? 'auto' : 'none'))

  const foodPointerEvents = useDerivedValue(() => (animationProgress.value > 0.5 ? 'auto' : 'none'))

  return (
    <View style={{ minHeight: containerHeight }}>
      <Animated.View
        style={[tourAnimatedStyle, { position: 'absolute', width: '100%' }]}
        pointerEvents={tourPointerEvents.value}
        onLayout={({ nativeEvent: { layout } }) => {
          setContainerHeight(layout.height)
        }}
      >
        <Typo className="mb-4 font-Medium text-xl text-gray-700">관광지도</Typo>
        {tourSelections.map(item => (
          <Selection
            key={item.id}
            {...item}
            onPress={() => !isAnimating && toggleSelection(item.id, 'tour')}
          />
        ))}
      </Animated.View>
      <Animated.View
        style={[foodAnimatedStyle, { position: 'absolute', width: '100%' }]}
        pointerEvents={foodPointerEvents.value}
      >
        <Typo className="mb-4 font-Medium text-xl text-gray-700">맛집지도</Typo>
        {foodSelections.map(item => (
          <View key={item.id} className="mb-4">
            <Selection {...item} onPress={() => !isAnimating && toggleSelection(item.id, 'food')} />
            {item.description && (
              <QuestionSection title={item.title} description={item.description} />
            )}
          </View>
        ))}
      </Animated.View>
    </View>
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
      className={`mb-3 w-full rounded-2xl ${
        isSelected ? 'border-blue-600 bg-BUSIM-blue-light' : 'border-gray-200 bg-white'
      } border p-4`}
    >
      <View className="flex-row items-center justify-center">
        <Typo className="mr-2 text-2xl">{icon}</Typo>
        <Typo
          className={`mr-4 font-SemiBold text-lg ${
            isSelected ? 'text-BUSIM-blue' : 'text-gray-800'
          }`}
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
