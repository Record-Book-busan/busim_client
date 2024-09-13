import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import React, { useCallback, useMemo, useRef } from 'react'
import { View, Text, Dimensions, Platform, TouchableOpacity } from 'react-native'

import { SvgIcon } from '@/shared'

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
  index: number
  name: string
  position?: string
  count: number
}

const ListItem = ({ index, name, position, count }: ListItemProps) => {
  return (
    <TouchableOpacity className="flex-row items-center p-2">
      <Text className="px-2 text-lg font-bold text-[#00339D]">{index}</Text>
      <View className="h-20 w-20 bg-[#BECCE8]" />
      <View className="h-20 justify-between px-2">
        <View>
          <Text className="text-md font-bold">{name}</Text>
          <View className="flex-row items-center gap-2">
            <SvgIcon name="marker" className="text-[#929292]" size={14} />
            <Text className="text-sm text-[#929292]">{position || '위치 정보 제공 칸입니다'}</Text>
          </View>
        </View>
        <Text className="text-sm text-[#929292]">조회 {count > 999 ? '999+' : count}</Text>
      </View>
    </TouchableOpacity>
  )
}

type ListViewItemProps = {
  name: string
  selectItems: string[]
  listItemProps: ListItemProps[]
}

const ListViewItem = ({ name, selectItems, listItemProps }: ListViewItemProps) => {
  return (
    <View className="items-center bg-white px-4 py-4">
      <View className="mt-8 w-full flex-row">
        <Text className="flex-1 text-left text-lg">{name}</Text>
        <View className="rounded-full bg-[#00339D] px-2 py-1">
          <Text className="text-white">{selectItems[0]} ▽</Text>
        </View>
      </View>
      <View className="w-full">
        {listItemProps.map(item => {
          return (
            <ListItem
              key={item.index}
              index={item.index}
              name={item.name}
              position={item.position}
              count={item.count}
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
      Math.max(Platform.OS === 'android' ? tabBarHeight - 20 : tabBarHeight + 5, 0), // 0: 바텀 탭 위에 살짝 보이는 높이 (최소 0)
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
        <View className="items-center bg-white px-4">
          <Text className="mt-8 w-full text-left text-lg">시장님이 다녀간 맛집 리스트</Text>
          <View className="my-2 h-24 w-full bg-red-400" />
          <Text className="text-md w-full text-left">사장님, 준비갈완~</Text>
        </View>
        <ListViewItem
          name="관광 지도 TOP 5"
          selectItems={['관광지도']}
          listItemProps={[
            {
              index: 1,
              name: '장소명',
              count: 1000,
            },
            {
              index: 2,
              name: '장소명',
              count: 1000,
            },
            {
              index: 3,
              name: '장소명',
              count: 1000,
            },
            {
              index: 4,
              name: '장소명',
              count: 1000,
            },
            {
              index: 5,
              name: '장소명',
              count: 1000,
            },
          ]}
        />
        <ListViewItem
          name="맛집 지도 TOP 5"
          selectItems={['관광지도']}
          listItemProps={[
            {
              index: 1,
              name: '장소명',
              count: 1000,
            },
            {
              index: 2,
              name: '장소명',
              count: 1000,
            },
            {
              index: 3,
              name: '장소명',
              count: 1000,
            },
            {
              index: 4,
              name: '장소명',
              count: 1000,
            },
            {
              index: 5,
              name: '장소명',
              count: 1000,
            },
          ]}
        />
      </BottomSheetScrollView>
    </BottomSheet>
  )
}
