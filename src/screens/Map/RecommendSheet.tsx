import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import {
  View,
  Dimensions,
  Platform,
  TouchableOpacity,
  Image,
  ImageURISource,
  ActivityIndicator,
} from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import Carousel from 'react-native-reanimated-carousel'

import { ImageCarousel } from '@/components/common'
import Indicator from '@/components/common/CarouselIndicator'
import DropBox from '@/components/common/DropBox'
import { SpecialCategories, SpecialCategoryType, useSpecialPlace } from '@/services/place'
import { SvgIcon, Typo } from '@/shared'
import { AuthStackParamList } from '@/types/navigation'

import type { StackNavigationProp } from '@react-navigation/stack'

const CustomHandle = () => {
  return (
    <View
      style={{
        backgroundColor: '#00339D',
        height: 30,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      }}
    >
      <SvgIcon name="handle" className="text-white" />
    </View>
  )
}

type ListItemProps = {
  images: ImageURISource
  id: number
  title: string
  categories: string[]
  detailedInformation: string
}

const ListItem = ({ title, categories, id, images }: ListItemProps) => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'SearchStack'>>()

  const handleButtonClick = useCallback((placeId: number) => {
    navigation.navigate('MapStack', {
      screen: 'MapDetail',
      params: {
        id: placeId,
        type: 'restaurant',
      },
    })
  }, [])

  return (
    <View className="my-2 h-[100px] flex-row items-center">
      <Image className="h-full w-20 rounded-[5px]" source={images} />
      <View className="flex h-full flex-1 gap-y-1 px-2">
        <Typo className="text-base font-bold">{title}</Typo>
        <View className="flex-row items-center gap-1">
          <SvgIcon name="category" className="text-black" size={14} />
          <Typo className="text-xs">{categories}</Typo>
        </View>
        {/* <View className="flex-row items-center gap-1">
          <SvgIcon name="explain" className="text-black" size={14} />
          <Typo className="text-xs">{detailedInformation}</Typo>
        </View> */}
      </View>
      <View className="px-2">
        <TouchableOpacity
          className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00339D]"
          onPress={() => handleButtonClick(id)}
        >
          <SvgIcon name="arrowRightWhite" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

type ListViewCarouselProps = {
  items: ListItemProps[]
  height?: number
  width?: number
}

const ListViewCarousel: React.FC<ListViewCarouselProps> = ({
  items,
  height = 477,
  width = 350,
}) => {
  const carouselRef = useRef(null)
  const progressValue = useSharedValue<number>(0)

  const chunkArray = (array: ListItemProps[], size: number) => {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
      array.slice(i * size, i * size + size),
    )
  }

  const chunkedItems = useMemo(() => chunkArray(items, 5), [items])

  return (
    <View className="relative">
      <Carousel
        ref={carouselRef}
        width={width}
        height={height}
        data={chunkedItems}
        onProgressChange={(_, absoluteProgress) => {
          progressValue.value = absoluteProgress
        }}
        renderItem={({ item }) => (
          <View className="mx-4 flex-1">
            {item.map((listItemProp, index) => (
              <ListItem
                key={index}
                title={listItemProp.title}
                categories={listItemProp.categories}
                detailedInformation={listItemProp.detailedInformation}
                id={listItemProp.id}
                images={listItemProp.images}
              />
            ))}
          </View>
        )}
      />
      {chunkedItems.length > 1 && (
        <Indicator
          count={chunkedItems.length}
          progressValue={progressValue}
          style={{ bottom: 25 }}
          dotStyle={{ backgroundColor: '#999999' }}
        />
      )}
    </View>
  )
}

interface RecommendSheetProps {
  headerHeight: number
}

export const RecommendSheet: React.FC<RecommendSheetProps> = ({ headerHeight }) => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'SearchStack'>>()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const { height: screenHeight } = Dimensions.get('window')
  const tabBarHeight = useBottomTabBarHeight()

  const snapPoints = useMemo(() => {
    const availableHeight =
      Platform.OS === 'android' ? screenHeight - headerHeight : screenHeight - headerHeight - 50

    return [
      Math.max(tabBarHeight - 20, 0), // 0: 바텀 탭 위에 살짝 보이는 높이 (최소 0)
      Math.max(availableHeight * 0.5, tabBarHeight + 20), // 1: 사용 가능한 높이의 중간
      availableHeight, // 2: 헤더 바로 아래까지
    ]
  }, [screenHeight, headerHeight, tabBarHeight])

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index)
    if (index < 0) {
      bottomSheetRef.current?.snapToIndex(0)
    }
  }, [])

  const [activeCategory, setActiveCategory] = useState<string>('OCEAN_VIEW')
  const { data: placeData, isFetching } = useSpecialPlace({
    category: activeCategory,
    offset: 0,
    limit: 25,
  })

  const handleItemClick = (item: string) => {
    setActiveCategory(item)
  }

  const handleWholeClick = useCallback(() => {
    navigation.navigate('MapStack', {
      screen: 'MapRecommend',
      params: {
        category: activeCategory as SpecialCategoryType,
      },
    })
  }, [activeCategory])

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      // backdropComponent={renderBackdrop}
      enablePanDownToClose={false}
      containerStyle={{
        zIndex: 50,
        shadowColor: 'black',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      }}
      handleStyle={{
        backgroundColor: '#00339D',
        height: 30,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      handleComponent={CustomHandle}
      bottomInset={50}
    >
      <BottomSheetScrollView className="z-50 flex-1" nestedScrollEnabled={true}>
        <View className="mb-4 items-center bg-white px-8">
          <Typo className="mt-4 w-full text-left text-2xl">시장님이 다녀간 맛집 리스트</Typo>
          <View className="my-2 flex h-[180px] w-[350px] items-center justify-center">
            {isFetching ? (
              <ActivityIndicator
                className="h-[180px] w-[350px] rounded-[20px] bg-BUSIM-slate-light"
                size="large"
              />
            ) : (
              <ImageCarousel
                height={180}
                width={350}
                rounded={20}
                images={placeData?.map(place => place.images).slice(0, 5) as ImageURISource[]}
                isAuto={true}
              />
            )}
          </View>
          <Typo className="w-full text-left text-base">사장님, 여기 맛집이에요!</Typo>
        </View>
        <View className="items-center border-t-2 border-[#DBDCE5] bg-white px-4 py-2">
          <Typo className="w-full py-2 text-center text-lg font-bold">추천 맛집</Typo>
          <View className="mt-2 w-[350px] flex-row items-center justify-between px-2">
            <DropBox
              keys={Object.values(SpecialCategories)}
              values={Object.keys(SpecialCategories)}
              selected={activeCategory}
              onItemClick={handleItemClick}
            />
            <TouchableOpacity
              className="flex w-16 flex-row items-center justify-start"
              onPress={handleWholeClick}
            >
              <Typo className="flex-1 text-left text-xs text-[#96979E]">전체 보기</Typo>
              <SvgIcon name="arrowRightBlack" size={14} className="text-[#96979E]" />
            </TouchableOpacity>
          </View>
          <View className="relative mx-8 mt-4 flex-1 rounded-2xl">
            {isFetching ? (
              <ActivityIndicator
                className="h-[180px] w-[335px] rounded-[20px] bg-BUSIM-slate-light"
                size="large"
              />
            ) : (
              <ListViewCarousel items={placeData as ListItemProps[]} />
            )}
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  )
}
