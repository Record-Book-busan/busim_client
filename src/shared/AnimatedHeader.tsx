import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  interpolateColor,
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useDerivedValue,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { SvgIcon } from './SvgIcon'

interface AnimatedHeaderProps {
  title: string
  scrollY: SharedValue<number>
  triggerPoint: number
  initialBackgroundColor: string
  finalBackgroundColor: string
  onBackPress?: () => void
}

export const AnimatedHeader = ({
  title,
  scrollY,
  triggerPoint,
  initialBackgroundColor,
  finalBackgroundColor,
  onBackPress,
}: AnimatedHeaderProps) => {
  const navigation = useNavigation()
  const { top } = useSafeAreaInsets()

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollY.value,
      [0, triggerPoint],
      [initialBackgroundColor, finalBackgroundColor],
    )
    return { backgroundColor }
  })

  const textStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, triggerPoint], [0, 1])
    return { opacity }
  })

  // const iconProps = useAnimatedProps(() => {
  //   const color = interpolateColor(scrollY.value, [0, triggerPoint], ['white', 'black'])
  //   return { color }
  // })

  const iconColor = useDerivedValue(() =>
    interpolateColor(scrollY.value, [0, triggerPoint], ['white', 'black']),
  )

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress()
    } else {
      navigation.goBack()
    }
  }

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          zIndex: 50,
          paddingTop: top,
        },
        animatedStyle,
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 16,
          paddingBottom: 10,
          paddingTop: 12,
        }}
      >
        <TouchableOpacity onPress={handleBackPress} style={{ width: 40 }}>
          <Animated.Text style={{ color: iconColor }}>
            <SvgIcon name="chevronLeft" width={18} height={18} />
          </Animated.Text>
        </TouchableOpacity>
        <Animated.Text
          style={[
            {
              flex: 1,
              textAlign: 'center',
              fontSize: 18,
              fontWeight: '600',
              color: 'black',
              includeFontPadding: false,
            },
            textStyle,
          ]}
          numberOfLines={1}
        >
          {title}
        </Animated.Text>
        <TouchableOpacity style={{ width: 40, alignItems: 'flex-end' }}>
          <Animated.Text style={{ color: iconColor }}>
            <SvgIcon name="x" width={22} height={22} />
          </Animated.Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}
