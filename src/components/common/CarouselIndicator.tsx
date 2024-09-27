import { StyleProp, View, ViewStyle } from 'react-native'
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

interface DotProps {
  index: number
  activeDotIndex: Animated.SharedValue<number>
  style: StyleProp<ViewStyle>
}

function Dot({ index, activeDotIndex, style }: DotProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const isActive = index === activeDotIndex.value
    return {
      width: withTiming(isActive ? 16 : 6, { duration: 150 }),
      opacity: withTiming(isActive ? 1 : 0.6, { duration: 150 }),
    }
  })

  return (
    <Animated.View
      style={[
        {
          height: 6,
          borderRadius: 3,
          backgroundColor: 'white',
          marginHorizontal: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 3,
        },
        animatedStyle,
        style,
      ]}
    />
  )
}

interface IndicatorProps {
  count: number
  progressValue: Animated.SharedValue<number>
  style?: StyleProp<ViewStyle>
  dotStyle?: StyleProp<ViewStyle>
}

export default function Indicator({ count, progressValue, style, dotStyle }: IndicatorProps) {
  const activeDotIndex = useSharedValue(0)

  useAnimatedReaction(
    () => progressValue.value,
    progress => {
      const newIndex = Math.round(progress) % count
      if (newIndex !== activeDotIndex.value) {
        activeDotIndex.value = newIndex
      }
    },
    [progressValue, count],
  )

  return (
    <View className="absolute bottom-3 mt-2 w-full flex-row justify-center" style={style}>
      {Array.from({ length: count }).map((_, index) => (
        <Dot style={dotStyle} key={index} index={index} activeDotIndex={activeDotIndex} />
      ))}
    </View>
  )
}
