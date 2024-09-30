import { View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolate,
  type SharedValue,
  Extrapolation,
} from 'react-native-reanimated'

import { window } from '@/constants'
import { Button, SvgIcon, Typo } from '@/shared'

type RecordFABProps = {
  isExpanded: SharedValue<boolean>
  onPress: () => void
}

const SCREEN_WIDTH = window.width
const COLLAPSED_WIDTH = 55
const EXPANDED_WIDTH = SCREEN_WIDTH * (2 / 3)

export function RecordFAB({ isExpanded, onPress }: RecordFABProps) {
  const animatedStyles = useAnimatedStyle(() => {
    const width = interpolate(
      isExpanded.value ? 1 : 0,
      [0, 1],
      [COLLAPSED_WIDTH, EXPANDED_WIDTH],
      Extrapolation.CLAMP,
    )

    return {
      width: withTiming(width, { duration: 300 }),
    }
  })

  const textAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(isExpanded.value ? 1 : 0, [0, 1], [0, 1], Extrapolation.CLAMP)

    return {
      opacity: withTiming(opacity, { duration: 300 }),
      maxWidth: withTiming(isExpanded.value ? EXPANDED_WIDTH - COLLAPSED_WIDTH : 0, {
        duration: 300,
      }),
    }
  })

  return (
    <Animated.View style={[animatedStyles]}>
      <Button
        type="button"
        variant="primary"
        size="full"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        onPress={onPress}
      >
        <View className="w-full flex-row items-center">
          <SvgIcon name="pencil" className="text-white" size={14} />
          <Animated.View style={[{ overflow: 'hidden' }, textAnimatedStyle]}>
            <Typo className="ml-4 font-SemiBold text-base text-white">여행 기록 쓰기</Typo>
          </Animated.View>
        </View>
      </Button>
    </Animated.View>
  )
}
