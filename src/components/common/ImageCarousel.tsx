import React, { useRef, useState } from 'react'
import { Image, View, TouchableOpacity, ImageResizeMode, ImageURISource } from 'react-native'
import Lightbox from 'react-native-lightbox-v2'
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
  /** 이미지 배열 또는 단일 값 */
  images: ImageURISource[] | ImageURISource
  /** 캐로셀 너비 */
  width?: number
  /** 캐로셀 높이 */
  height?: number
  resizeMode?: ImageResizeMode
}

export function ImageCarousel({ images, width, height, resizeMode }: ImageCarouselProps) {
  const progressValue = useSharedValue<number>(0)
  const ref = useRef<ICarouselInstance>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const carouselWidth = width ? width : SCREEN_WIDTH
  const carouselHeight = height ? height : (carouselWidth * 3) / 4

  const imageArray = Array.isArray(images) ? images : [images]

  const renderLightboxContent = () => (
    <Carousel
      width={SCREEN_WIDTH}
      height={SCREEN_WIDTH}
      loop
      enabled
      data={imageArray}
      renderItem={({ item }) => (
        <Image
          source={item}
          style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH, resizeMode: 'contain' }}
        />
      )}
    />
  )

  return (
    <View className="relative overflow-hidden">
      <Lightbox
        activeProps={{
          style: {
            width: SCREEN_WIDTH,
            height: SCREEN_WIDTH,
          },
        }}
        springConfig={{ tension: 15, friction: 7 }}
        renderContent={renderLightboxContent}
        onOpen={() => setLightboxOpen(true)}
        onClose={() => setLightboxOpen(false)}
      >
        <Carousel
          width={carouselWidth}
          height={carouselHeight}
          loop
          enabled={!lightboxOpen}
          ref={ref}
          autoPlay={false}
          data={imageArray}
          onProgressChange={(_, absoluteProgress) => {
            progressValue.value = absoluteProgress
          }}
          renderItem={({ item, index }) => (
            <ImageItem key={index} item={item} index={index} resizeMode={resizeMode || 'cover'} />
          )}
        />
      </Lightbox>
      {imageArray.length > 1 && (
        <Indicator count={imageArray.length} progressValue={progressValue} />
      )}
    </View>
  )
}

interface ItemProps {
  index: number
  item: ImageURISource
  resizeMode: ImageResizeMode
}

function ImageItem({ item, resizeMode }: ItemProps) {
  return (
    <TouchableOpacity activeOpacity={0.9}>
      <ImageVariant className="h-full w-full" source={item} resizeMode={resizeMode} />
    </TouchableOpacity>
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
