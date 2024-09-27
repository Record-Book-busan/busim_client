import React, { useRef, useState } from 'react'
import { Image, View, TouchableOpacity, ImageResizeMode, ImageURISource } from 'react-native'
import Lightbox from 'react-native-lightbox-v2'
import { useSharedValue } from 'react-native-reanimated'
import Carousel, { type ICarouselInstance } from 'react-native-reanimated-carousel'

import { window } from '@/constants'
import { ImageVariant } from '@/shared'

import Indicator from './CarouselIndicator'

const SCREEN_WIDTH = window.width

interface ImageCarouselProps {
  /** 이미지 배열 또는 단일 값 */
  images: ImageURISource[] | ImageURISource
  /** 캐로셀 너비 */
  width?: number
  /** 캐로셀 높이 */
  height?: number
  resizeMode?: ImageResizeMode
  rounded?: number
  isAuto?: boolean
  autoInterval?: number
}

export function ImageCarousel({
  images,
  width,
  height,
  resizeMode,
  rounded = 0,
  isAuto = false,
  autoInterval = 2000,
}: ImageCarouselProps) {
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
          style={{
            borderRadius: rounded,
          }}
          enabled={!lightboxOpen}
          ref={ref}
          autoPlay={isAuto}
          autoPlayInterval={autoInterval}
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
  onClickImage?: (id: string) => void
}

function ImageItem({ item, resizeMode }: ItemProps) {
  return (
    <TouchableOpacity activeOpacity={0.9}>
      <ImageVariant className="h-full w-full" source={item} resizeMode={resizeMode} />
    </TouchableOpacity>
  )
}
