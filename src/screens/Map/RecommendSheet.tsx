/* eslint-disable */
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { View, Dimensions, Platform, TouchableOpacity, Image, ImageURISource } from 'react-native'

import { ImageCarousel } from '@/components/common'
import DropBox from '@/components/common/DropBox'
import { useNavigateWithPermissionCheck } from '@/hooks/useNavigationPermissionCheck'
import { validateImageUris, baseUri } from '@/services/image'
import { SvgIcon, Typo } from '@/shared'
import { RootStackParamList } from '@/types/navigation'

import { getCategoryType } from '../Search/Search'

import type { StackNavigationProp } from '@react-navigation/stack'
import { useSpecialPlace } from '@/services/place'
import Carousel from 'react-native-reanimated-carousel'
import Indicator from '@/components/common/CarouselIndicator'
import { useSharedValue } from 'react-native-reanimated'

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
  name: string
  category: string
  explain: string
  id: number
}

const ListItem = ({ name, category, explain, id }: ListItemProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'SearchStack'>>()
  const { navigateWithPermissionCheck } = useNavigateWithPermissionCheck()

  const handleButtonClick = (placeId: number) => {
    navigateWithPermissionCheck({
      navigation,
      routeName: 'SearchStack',
      params: {
        screen: 'Detail',
        params: {
          id: placeId,
          type: getCategoryType('맛집'),
        },
      },
    })
  }

  return (
    <View className="h-28 flex-row items-center py-2">
      <Image className="h-full w-20 rounded-lg" source={baseUri} />
      <View className="flex h-full flex-1 gap-y-1 px-2">
        <Typo className="font-bold">{name}</Typo>
        <View className="flex-row items-center gap-1">
          <SvgIcon name="category" className="text-black" size={14} />
          <Typo className="text-xs">{category}</Typo>
        </View>
        <View className="flex-row items-center gap-1">
          <SvgIcon name="explain" className="text-black" size={14} />
          <Typo className="text-xs">{explain}</Typo>
        </View>
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
  height = 590,
  width = 400,
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
        autoPlay={true}
        autoPlayInterval={10000}
        onProgressChange={(_, absoluteProgress) => {
          progressValue.value = absoluteProgress
        }}
        renderItem={({ item }) => (
          <View className="mx-4 flex-1">
            {item.map((listItemProp, index) => (
              <ListItem
                key={index}
                name={listItemProp.name}
                category={listItemProp.category}
                explain={listItemProp.explain}
                id={listItemProp.id}
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

  // const renderBackdrop = (props: BottomSheetBackdropProps) => (
  //   <BottomSheetBackdrop {...props} appearsOnIndex={1} disappearsOnIndex={0} />
  // )

  const [imageUris, setImageUris] = useState<ImageURISource[]>([
    require('@/assets/images/logo-blue.png'),
    require('@/assets/images/logo-blue.png'),
    require('@/assets/images/logo-blue.png'),
    require('@/assets/images/logo-blue.png'),
    require('@/assets/images/logo-blue.png'),
  ])
  const [listViewItems, setListViewItems] = useState<ListItemProps[]>([
    { name: '장소명', category: '오션뷰', explain: '장소1 설명입니다', id: 1 },
    { name: '장소명', category: '오션뷰', explain: '장소2 설명입니다', id: 1 },
    { name: '장소명', category: '맛집', explain: '장소3 설명입니다', id: 1 },
    { name: '장소명', category: '테스트', explain: '장소4 설명입니다', id: 1 },
    { name: '장소명', category: '맛집', explain: '장소5 설명입니다', id: 1 },
    { name: '장소명', category: '오션뷰', explain: '장소6 설명입니다', id: 1 },
    { name: '장소명', category: '맛집', explain: '장소7 설명입니다', id: 1 },
    { name: '장소명', category: '오션뷰', explain: '장소8 설명입니다', id: 1 },
    { name: '장소명', category: '오션뷰', explain: '장소9 설명입니다', id: 1 },
    { name: '장소명', category: '오션뷰', explain: '장소10 설명입니다', id: 1 },
  ])
  const [filteredListViewItems, setFilteredListViewItems] = useState<ListItemProps[]>([])
  const [categories, setCategories] = useState<string[]>(['오션뷰', '맛집', '테스트'])
  const [activeCategory, setActiveCategory] = useState<string>(categories[0])

  useEffect(() => {
    const filtered = listViewItems.filter(listViewItem => {
      return listViewItem.category === activeCategory
    })

    setFilteredListViewItems(filtered)
  }, [activeCategory])

  // const { data: placeData } = useSpecialPlace({
  //   lat: 35.2002495716857,
  //   lng: 129.16,
  //   level: 'LEVEL_10',
  //   restaurantCategories: 'SPECIAL_RESTAURANT',
  //   touristCategories: '',
  //   isEnabled: true,
  // })

  // useEffect(() => {
  //   const placeUrls: string[] = []

  //   placeData?.map((place) => {
  //     if(placeUrls.length < 5 && !!place.imageUrl && place.imageUrl.length > 0) placeUrls.push((place.imageUrl as string[])[0].replace("_tti", ""))
  //   })

  //   const listItems = placeData?.map((place) => ({
  //     name: place?.title,
  //     category: '특별한_맛집',
  //     explain: place?.content,
  //     id: place.id,
  //   }))

  //   setValidateUris(placeUrls)
  //   setListViewItems(listItems as ListItemProps[])
  // }, [placeData])

  // const setValidateUris = async (imageUrls: string[]) => {
  //   const validateUrls = await validateImageUris(imageUrls)
  //   setImageUris(validateUrls)
  // }

  const handleItemClick = (item: string) => {
    setActiveCategory(item)
  }

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
        <View className="mb-4 items-center bg-white px-4">
          <Typo className="mt-8 w-full text-left text-lg">시장님이 다녀간 맛집 리스트</Typo>
          <View className="my-2 flex h-[180px] items-center justify-center rounded-2xl">
            <ImageCarousel height={180} width={350} rounded={20} images={imageUris} />
          </View>
          <Typo className="text-md w-full text-left">사장님, 여기 맛집이에요!</Typo>
        </View>
        <View className="items-center border-t-2 border-[#DBDCE5] bg-white px-4 py-2">
          <Typo className="w-full py-2 text-center text-lg font-bold">추천 맛집</Typo>
          <View className="mt-2 w-full flex-row items-center justify-end">
            <DropBox items={categories} selected={activeCategory} onItemClick={handleItemClick} />
            {/* <TouchableOpacity className="flex flex-row items-center justify-start w-16">
              <Typo className="flex-1 text-left text-xs text-[#96979E]">전체 보기</Typo>
              <SvgIcon name="arrowRightBlack" size={14} className="text-[#96979E]" />
            </TouchableOpacity> */}
          </View>
          <View className="relative mx-4 mt-4 flex-1">
            <ListViewCarousel items={filteredListViewItems} />
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  )
}
