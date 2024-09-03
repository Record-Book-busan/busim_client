import { NavigationProp, RouteProp, useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'
import { Platform, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { MapDetail } from '@/components/map'
import { ImageVariant, SafeScreen, SvgIcon } from '@/shared'

import type { SearchStackParamList, RootStackParamList } from '@/types/navigation'

const HEADER_CONTENT_HEIGHT = 50
const HEADER_HEIGHT =
  Platform.OS === 'ios' ? HEADER_CONTENT_HEIGHT + 44 : HEADER_CONTENT_HEIGHT + 10

function DetailScreen({ route }: { route: RouteProp<SearchStackParamList, 'Detail'> }) {
  useEffect(() => {
    console.log(route.params)
  }, [])

  const insets = useSafeAreaInsets()
  const headerHeight = HEADER_HEIGHT + insets.top

  const navigation = useNavigation<NavigationProp<RootStackParamList, 'SearchStack'>>()

  const detail = {
    title: '장소명',
    category: ['지연', '테마'],
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfVhju-h_98uFgOD8WzzMMHJ9PEkPSIhdRVA&s',
    ],
    geometry: {
      lon: 33.450701,
      lat: 126.570667,
    },
    time: '',
    introduce: '',
    more: {
      url: '',
      instagram: '',
      holiday: '수요일 휴무\n수요일이 공휴일인 경우 개관(다른날 휴무)',
      phoneNumber: '041-730-2955',
    },
  }

  const moveSearchHandler = () => {
    navigation.navigate('SearchStack', {
      screen: 'Search',
      params: { keyword: 'test', selected: 'record' },
    })
  }

  const bookMarkHandler = () => {
    console.log(`bookmark now`)
  }

  return (
    <SafeScreen>
      <View
        className="absolute left-0 right-0 z-50"
        style={{
          top: HEADER_HEIGHT,
          paddingTop: insets.top,
          height: headerHeight,
        }}
      >
        <TouchableOpacity
          className="mx-1 flex h-9 w-16 flex-row items-center justify-center gap-2 rounded-2xl border bg-white"
          onPress={moveSearchHandler}
        >
          <Text className="text-center text-xs text-black">여행기록 보러가기</Text>
          <SvgIcon name="arrowRightBlack" />
        </TouchableOpacity>
      </View>
      <View className="border-t-2 border-[#DADADA]">
        <View className="flex">
          {detail.images.map((item, index) => (
            <ImageVariant className="h-64 w-full rounded-2xl" key={index} source={{ uri: item }} />
          ))}
          <View className="flex flex-row justify-center">
            <Text>{detail.title}</Text>
            <TouchableOpacity onPress={bookMarkHandler}>
              <SvgIcon name="bookmark" />
            </TouchableOpacity>
          </View>
          <View className="flex flex-row gap-2">
            {detail.category.map((item, index) => (
              <View
                key={index}
                className="mx-1 flex h-9 w-16 justify-center rounded-2xl border bg-[#2653B0]"
              >
                <Text className="text-center text-xs text-white">{item}</Text>
              </View>
            ))}
          </View>
          <View className="my-4 h-36 w-full">
            <MapDetail geometry={detail.geometry} />
          </View>
          <View className="flex flex-row px-2 py-1">
            <SvgIcon name="marekrBorderGray" />
            <Text className="ml-2">
              경도: {detail.geometry.lon}, 위도: {detail.geometry.lat}
            </Text>
          </View>
          <View className="flex flex-row px-2 py-1">
            <SvgIcon name="marekrBorderGray" />
            <Text className="ml-2">{detail.time || '운영시간 정보 제공 칸입니다'}</Text>
          </View>
        </View>
        <View className="my-2 w-full border-t-2 border-[#DADADA]">
          <Text className="my-2">장소 소개</Text>
          <View className="w-full rounded-r-xl bg-[#BECCE8] px-2 py-4">
            <Text>{detail.introduce || '장소 소개'}</Text>
          </View>
          <Text className="my-2">정보</Text>
          <View className="flex w-full gap-2 rounded-r-xl bg-[#BECCE8] px-2 py-4">
            <Text>{detail.more.url || '웹사이트 링크'}</Text>
            <Text>{detail.more.instagram || '인스타그램 링크'}</Text>
            <Text>{detail.more.holiday || '휴무일'}</Text>
            <Text>{detail.more.phoneNumber || '전화번호'}</Text>
          </View>
        </View>
      </View>
    </SafeScreen>
  )
}

export default DetailScreen
