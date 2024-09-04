import React, { useRef } from 'react'
import {
  ActivityIndicator,
  Animated,
  Image,
  ImageSourcePropType,
  ImageURISource,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native'
import { LongPressGestureHandler, type PanGesture, ScrollView } from 'react-native-gesture-handler'
import { useSharedValue } from 'react-native-reanimated'
import Carousel, { type ICarouselInstance } from 'react-native-reanimated-carousel'
import { SafeAreaView } from 'react-native-safe-area-context'

import { window } from '@/constants'

const SCREEN_WIDTH = window.width // 임의의 값, 실제 앱에서는 Dimensions.get('window').width를 사용하세요

export function ImageCarouselTest() {
  const windowWidth = useWindowDimensions().width
  const scrollOffsetValue = useSharedValue<number>(0)
  const [data, setData] = React.useState([...new Array(4).keys()])
  const [isVertical, setIsVertical] = React.useState(false)
  const [isFast, setIsFast] = React.useState(false)
  const [isAutoPlay, setIsAutoPlay] = React.useState(false)
  const [isPagingEnabled, setIsPagingEnabled] = React.useState(true)
  const ref = useRef<ICarouselInstance>(null)

  const baseOptions = isVertical
    ? {
        vertical: true,
        width: windowWidth,
        height: SCREEN_WIDTH / 2,
      }
    : {
        vertical: false,
        width: windowWidth,
        height: SCREEN_WIDTH / 2,
      }

  return (
    <SafeAreaView className="flex-1">
      <Carousel
        {...baseOptions}
        loop
        enabled
        ref={ref}
        defaultScrollOffsetValue={scrollOffsetValue}
        testID={'xxx'}
        style={{
          width: '100%',
        }}
        autoPlay={isAutoPlay}
        autoPlayInterval={isFast ? 100 : 2000}
        data={data}
        onScrollBegin={() => {
          console.log('===1')
        }}
        onScrollEnd={() => {
          console.log('===2')
        }}
        onConfigurePanGesture={(g: PanGesture) => g.enabled(false)}
        pagingEnabled={isPagingEnabled}
        onSnapToItem={index => console.log('current index:', index)}
        renderItem={({ index }) => <SBItem key={index} index={index} />}
      />
      <ScrollView className="flex-1">
        <SButton
          onPress={() => {
            setData([...new Array(5).keys()])
          }}
        >
          {'Change the data length to 5'}
        </SButton>
        <SButton
          onPress={() => {
            setData([...new Array(3).keys()])
          }}
        >
          {'Change the data length to 3'}
        </SButton>
        <SButton
          onPress={() => {
            setIsVertical(!isVertical)
          }}
        >
          {isVertical ? 'Set horizontal' : 'Set Vertical'}
        </SButton>
        <SButton
          onPress={() => {
            setIsFast(!isFast)
          }}
        >
          {isFast ? 'NORMAL' : 'FAST'}
        </SButton>
        <SButton
          onPress={() => {
            setIsPagingEnabled(!isPagingEnabled)
          }}
        >
          PagingEnabled:{isPagingEnabled.toString()}
        </SButton>
        <SButton
          onPress={() => {
            setIsAutoPlay(!isAutoPlay)
          }}
        >
          {'오토플레이'}:{`${isAutoPlay}`}
        </SButton>
        <SButton
          onPress={() => {
            console.log(ref.current?.getCurrentIndex())
          }}
        >
          Log current index
        </SButton>
        <SButton
          onPress={() => {
            setData(data.length === 6 ? [...new Array(8).keys()] : [...new Array(6).keys()])
          }}
        >
          Change data length to:{data.length === 6 ? 8 : 6}
        </SButton>
        <SButton
          onPress={() => {
            ref.current?.scrollTo({ count: -1, animated: true })
          }}
        >
          prev
        </SButton>
        <SButton
          onPress={() => {
            ref.current?.scrollTo({ count: 1, animated: true })
          }}
        >
          next
        </SButton>
      </ScrollView>
    </SafeAreaView>
  )
}

interface ISButtonProps {
  visible?: boolean
  onPress?: () => void
  children: React.ReactNode
}

const SButton: React.FC<ISButtonProps> = ({ children, visible = true, onPress }) => {
  if (!visible) return null

  return (
    <View className="flex-row items-center justify-center">
      <TouchableOpacity onPress={onPress}>
        <View className="mt-5 rounded-full bg-[#26292E] px-5 py-2.5">
          <Text className="text-white">{children}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

interface SBItemProps {
  index?: number
  pretty?: boolean
  showIndex?: boolean
  img?: ImageSourcePropType
}

export const SBItem: React.FC<SBItemProps> = ({ showIndex = true, index, pretty, img }) => {
  const [isPretty, setIsPretty] = React.useState(pretty || false)
  return (
    <LongPressGestureHandler
      onActivated={() => {
        setIsPretty(!isPretty)
      }}
    >
      <Animated.View className="flex-1">
        {isPretty || img ? (
          <SBImageItem index={index} showIndex={typeof index === 'number' && showIndex} img={img} />
        ) : (
          <SBTextItem index={index} />
        )}
      </Animated.View>
    </LongPressGestureHandler>
  )
}

interface SBImageItemProps {
  index?: number
  showIndex?: boolean
  img?: ImageSourcePropType
}

export const SBImageItem: React.FC<SBImageItemProps> = ({
  index: _index,
  showIndex = true,
  img,
}) => {
  const index = _index ?? 0
  const source = React.useRef<ImageURISource>({
    uri: `https://picsum.photos/id/${index}/400/300`,
  }).current

  return (
    <View className="flex-1 items-center justify-center overflow-hidden rounded-lg bg-transparent">
      <ActivityIndicator size="small" />
      <Image className="absolute h-full w-full" source={img ?? source} />
      {showIndex && (
        <Text className="absolute overflow-hidden rounded bg-[#EAEAEA] px-2.5 pt-0.5 text-4xl text-[#6E6E6E]">
          {index}
        </Text>
      )}
    </View>
  )
}

interface SBTextItemProps {
  index?: number
}

export const SBTextItem: React.FC<SBTextItemProps> = ({ index }) => {
  return (
    <View className="flex-1 items-center justify-center rounded-lg border border-red-500 bg-white">
      {typeof index === 'number' && <Text className="text-3xl text-black">{index}</Text>}
    </View>
  )
}
