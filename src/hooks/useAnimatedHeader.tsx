import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'

export const useAnimatedHeader = () => {
  const scrollY = useSharedValue(0)

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    'worklet'
    scrollY.value = event.nativeEvent.contentOffset.y
  }

  return { scrollY, handleScroll }
}
