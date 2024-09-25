import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { View, Dimensions, Platform, TouchableOpacity, Image } from 'react-native'

import { ImageCarousel } from '@/components/common'
import DropBox from '@/components/common/DropBox'
import { validateImageUris, baseUri } from '@/services/image'
import { SvgIcon, Typo } from '@/shared'
import { RootStackParamList } from '@/types/navigation'

import { getCategoryType } from '../Search/Search'

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
  name: string
  category: string
  explain: string
  id: number
}

const ListItem = ({ name, category, explain, id }: ListItemProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'SearchStack'>>()

  const handleButtonClick = (placeId: number) => {
    navigation.navigate('SearchStack', {
      screen: 'Detail',
      params: { id: placeId, type: getCategoryType('맛집') },
    })
  }

  return (
    <View className="h-28 flex-row items-center py-2">
      <Image className="h-full w-20 rounded-lg" src={baseUri} />
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

type ListViewItemProps = {
  name: string
  selectItems: string[]
  listItemProps: ListItemProps[]
}

const ListViewItem = ({ name, selectItems, listItemProps }: ListViewItemProps) => {
  return (
    <View className="items-center border-t-2 border-[#DBDCE5] bg-white px-4 py-2">
      <View className="mt-2 w-full flex-row items-center">
        <Typo className="flex-1 text-left text-lg">{name}</Typo>
        <DropBox items={selectItems} />
      </View>
      <View className="w-full">
        {listItemProps.map((listItemProp, index) => {
          return (
            <ListItem
              key={index}
              name={listItemProp.name}
              category={listItemProp.category}
              explain={listItemProp.explain}
              id={listItemProp.id}
            />
          )
        })}
      </View>
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

  const [imageUris, setImageUris] = useState<string[]>(['test1', 'test2'])

  useEffect(() => {
    const setValidateUris = async () => {
      const validateUris = await validateImageUris(imageUris)
      setImageUris(validateUris)
    }

    setValidateUris()
  }, [])

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
      <BottomSheetScrollView className="z-50 flex-1">
        <View className="mb-4 items-center bg-white px-4">
          <Typo className="mt-8 w-full text-left text-lg">시장님이 다녀간 맛집 리스트</Typo>
          <View className="my-2 flex h-[180px] w-full items-center justify-center rounded-2xl bg-BUSIM-slate">
            <ImageCarousel height={180} resizeMode="contain" images={imageUris} />
          </View>
          <Typo className="text-md w-full text-left">사장님, 여기 맛집이에요!</Typo>
        </View>
        <ListViewItem
          name="추천 맛집"
          selectItems={['오션뷰', '맛집', '테마']}
          listItemProps={[
            {
              name: '장소명',
              category: '오션뷰',
              explain: '장소1 설명입니다',
              id: 1,
            },
            {
              name: '장소명',
              category: '오션뷰',
              explain: '장소2 설명입니다',
              id: 1,
            },
            {
              name: '장소명',
              category: '오션뷰',
              explain: '장소3 설명입니다',
              id: 1,
            },
            {
              name: '장소명',
              category: '오션뷰',
              explain: '장소4 설명입니다',
              id: 1,
            },
            {
              name: '장소명',
              category: '오션뷰',
              explain: '장소5 설명입니다',
              id: 1,
            },
          ]}
        />
      </BottomSheetScrollView>
    </BottomSheet>
  )
}
