/* eslint-disable */
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  View,
  Dimensions,
  Platform,
  TouchableOpacity,
  Image,
  ImageURISource,
  ActivityIndicator,
} from 'react-native'

import { ImageCarousel } from '@/components/common'
import DropBox from '@/components/common/DropBox'
import { useNavigateWithPermissionCheck } from '@/hooks/useNavigationPermissionCheck'
import { validateImageUris, baseUri, validateImageUri } from '@/services/image'
import { SvgIcon, Typo } from '@/shared'
import { RootStackParamList } from '@/types/navigation'

import { getCategoryType } from '../Search/Search'

import type { StackNavigationProp } from '@react-navigation/stack'
import { useSpecialPlace } from '@/services/place'
import Carousel from 'react-native-reanimated-carousel'
import Indicator from '@/components/common/CarouselIndicator'
import { useSharedValue } from 'react-native-reanimated'
import { CategoryType, getCategoryText } from '@/constants'

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
  uri: ImageURISource
}

const ListItem = ({ name, category, explain, id, uri }: ListItemProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'SearchStack'>>()
  const { navigateWithPermissionCheck } = useNavigateWithPermissionCheck()

  const handleButtonClick = useCallback((placeId: number) => {
    navigateWithPermissionCheck({
      navigation,
      routeName: 'SearchStack',
      params: {
        screen: 'Detail',
        params: {
          id: placeId,
          type: getCategoryType('투어'),
        },
      },
    })
  }, [])

  return (
    <View className="h-28 flex-row items-center py-2">
      <Image className="h-full w-20 rounded-lg" source={uri} />
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
                uri={listItemProp.uri}
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

  const [isLoadingImageCarousel, setIsLoadingImageCarousel] = useState<boolean>(true)
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true)
  const [imageUris, setImageUris] = useState<ImageURISource[]>([])
  const [listViewItems, setListViewItems] = useState<ListItemProps[]>([])
  const [filteredListViewItems, setFilteredListViewItems] = useState<ListItemProps[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<string>()

  useEffect(() => {
    if (!!listViewItems && listViewItems?.length > 0) {
      const filtered = listViewItems.filter(listViewItem => {
        return listViewItem.category === activeCategory
      })

      setFilteredListViewItems(filtered)
      setIsLoadingContent(false)
    }
  }, [listViewItems, activeCategory])

  const { data: placeData } = useSpecialPlace({
    lat: 35.2002495716857,
    lng: 129.16,
    level: 'LEVEL_10',
    restaurantCategories: '',
    touristCategories: 'TOURIST_SPOT',
    isEnabled: true,
  })

  const getListItems = async () => {
    const listItems = await Promise.all(
      placeData?.map(async place => ({
        name: place?.title,
        category: getCategoryText(place.touristCat2 as CategoryType),
        explain: place?.content || place?.report,
        id: place.id,
        uri: await validateImageUri(place?.imageUrl2 || ''),
      })) || [],
    )

    return listItems
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingImageCarousel(true)
      setIsLoadingContent(true)

      const placeUrls: string[] = []

      placeData?.forEach(place => {
        if (placeUrls.length < 5 && !!place.imageUrl2) {
          placeUrls.push(place?.imageUrl2 as string)
        }
      })

      const listItems = await getListItems()

      const categoriesSet = new Set<string>()
      listItems.forEach(listItem => {
        categoriesSet.add(listItem.category)
      })

      setValidateUris(placeUrls)
      setIsLoadingImageCarousel(false)
      setListViewItems(listItems as ListItemProps[])
      setCategories(Array.from(categoriesSet))
      setActiveCategory(Array.from(categoriesSet)[0])
    }

    fetchData()
  }, [placeData])

  const setValidateUris = async (imageUrls: string[]) => {
    const validateUrls = await validateImageUris(imageUrls)
    setImageUris(validateUrls)
  }

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
          <Typo className="mt-4 w-full text-left text-lg">부산 관광지 리스트</Typo>
          <View className="my-2 flex h-[180px] w-[380px] items-center justify-center">
            {isLoadingImageCarousel ? (
              <ActivityIndicator
                className="h-[180px] w-[380px] rounded-[20px] bg-BUSIM-slate-light"
                size="large"
              />
            ) : (
              <ImageCarousel
                height={180}
                width={380}
                rounded={20}
                images={imageUris}
                isAuto={true}
              />
            )}
          </View>
          <Typo className="text-md w-full text-left">부산의 다양한 명소를 둘러보세요!</Typo>
        </View>
        <View className="items-center border-t-2 border-[#DBDCE5] bg-white px-4 py-2">
          <Typo className="w-full py-2 text-center text-lg font-bold">추천 관광지</Typo>
          <View className="mt-2 w-full flex-row items-center justify-end">
            <DropBox items={categories} selected={activeCategory} onItemClick={handleItemClick} />
            {/* <TouchableOpacity className="flex flex-row items-center justify-start w-16">
              <Typo className="flex-1 text-left text-xs text-[#96979E]">전체 보기</Typo>
              <SvgIcon name="arrowRightBlack" size={14} className="text-[#96979E]" />
            </TouchableOpacity> */}
          </View>
          <View className="relative mx-4 mt-4 flex-1 rounded-2xl">
            {isLoadingContent ? (
              <ActivityIndicator
                className="h-[280px] w-[380px] rounded-[20px] bg-BUSIM-slate-light"
                size="large"
              />
            ) : (
              <ListViewCarousel items={filteredListViewItems} />
            )}
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  )
}
