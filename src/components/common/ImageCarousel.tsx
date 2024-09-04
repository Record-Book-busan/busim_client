import { useRef } from 'react'
import { Pressable, View } from 'react-native'
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import Carousel, { type ICarouselInstance } from 'react-native-reanimated-carousel'

import { window } from '@/constants'
import { ImageVariant } from '@/shared'

const SCREEN_WIDTH = window.width

interface ImageCarouselProps {
  /** 이미지 배열 */
  images: string[]
  /** 캐로셀 너비 */
  /** 캐로셀 높이 */
  width?: number
  height?: number
}

export function ImageCarousel({ images, width, height }: ImageCarouselProps) {
  const progressValue = useSharedValue<number>(0)
  const ref = useRef<ICarouselInstance>(null)

  const carouselWidth = width ? width : SCREEN_WIDTH - 32
  const carouselHeight = height ? height : (carouselWidth * 3) / 4

  return (
    <View className="relative overflow-hidden rounded-xl">
      <Carousel
        width={carouselWidth}
        height={carouselHeight}
        loop
        enabled
        ref={ref}
        autoPlay={false}
        data={images}
        onProgressChange={(_, absoluteProgress) => {
          progressValue.value = absoluteProgress
        }}
        renderItem={info => <ImageItem key={info.index} item={info.item} index={info.index} />}
      />
      <Indicator count={images.length} progressValue={progressValue} />
    </View>
  )
}

interface ItemProps {
  index: number
  item: string
}

function ImageItem({ index, item }: ItemProps) {
  return (
    <Pressable onPress={() => console.log('이미지 클릭!:', index)}>
      <ImageVariant className="h-full w-full" source={{ uri: item }} resizeMode="cover" />
    </Pressable>
  )
}

interface IndicatorProps {
  count: number
  progressValue: Animated.SharedValue<number>
}

function Indicator({ count, progressValue }: IndicatorProps) {
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
    <View className="absolute bottom-3 mt-2 w-full flex-row justify-center">
      {Array.from({ length: count }).map((_, index) => (
        <Dot key={index} index={index} activeDotIndex={activeDotIndex} />
      ))}
    </View>
  )
}

interface DotProps {
  index: number
  activeDotIndex: Animated.SharedValue<number>
}

function Dot({ index, activeDotIndex }: DotProps) {
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
      ]}
    />
  )
}
