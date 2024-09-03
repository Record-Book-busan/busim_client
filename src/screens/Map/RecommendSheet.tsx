import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import React, { useCallback, useMemo, useRef } from 'react'
import { View, Text, Dimensions } from 'react-native'

interface RecommendSheetProps {
  headerHeight: number
}

// TODO: 안드로이드에서 바텀시트 높이 확인 필요
export const RecommendSheet: React.FC<RecommendSheetProps> = ({ headerHeight }) => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const { height: screenHeight } = Dimensions.get('window')
  const tabBarHeight = useBottomTabBarHeight()

  const snapPoints = useMemo(() => {
    const availableHeight = screenHeight - headerHeight

    return [
      Math.max(tabBarHeight + 50, 0), // 0: 바텀 탭 위에 살짝 보이는 높이 (최소 0)
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
    >
      <BottomSheetScrollView className="z-50 flex-1">
        <View className="items-center justify-center bg-gray-100">
          <Text className="text-lg font-bold">0 단계 뷰</Text>
        </View>
        <View className="h-72 items-center justify-center bg-gray-200">
          <Text className="text-lg font-bold">1 단계 뷰</Text>
        </View>
        <View className="h-96 items-center justify-center bg-gray-300">
          <Text className="text-lg font-bold">2 단계 뷰</Text>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  )
}
