import { type NavigationProp, type RouteProp, useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'

import { BookmarkButton, ImageCarousel, SafeScreen, Tag } from '@/components/common'
import { MapDetail } from '@/components/map'
import { CATEGORY, CategoryType } from '@/constants'
import { getCategoryDetail } from '@/services/service'
import { FAB, SvgIcon, type IconName } from '@/shared'

import type { SearchStackParamList, RootStackParamList } from '@/types/navigation'

interface DetailScreenProps {
  route: RouteProp<SearchStackParamList, 'Detail'>
}

type getCategoryDetailResponseType = {
  id: number
  title: string
  content: string
  imageUrl: string[]
  imageUrl2: string
  address: string
  addressDetail: string
  zipcode: string
  lat: number
  lng: number
  cat1: string
  cat2: CategoryType
  operatingTime: string
  phone: string
}

const mockData: getCategoryDetailResponseType = {
  id: 1,
  title: '부산 해운대 해수욕장',
  content: '한국에서 가장 유명한 해수욕장 중 하나로, 여름철 많은 사람들이 방문하는 관광지입니다.',
  imageUrl: [
    'https://picsum.photos/600/400',
    'https://picsum.photos/600/400',
    'https://picsum.photos/600/400',
    'https://picsum.photos/600/400',
  ],
  imageUrl2: '',
  address: '부산광역시 해운대구 우동',
  addressDetail: '',
  zipcode: '48094',
  lat: 36.1587,
  lng: 128.1603,
  cat1: 'PLACE',
  cat2: CATEGORY.관광지,
  // cat2: [CATEGORY.관광지, CATEGORY.특별한_맛집],
  operatingTime: '09:00 - 18:00 (여름 시즌)',
  phone: '051-123-4567',
  // isBookMarked: true,
}

export default function DetailScreen({ route }: DetailScreenProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'SearchStack'>>()
  const [data, setData] = useState<getCategoryDetailResponseType>(mockData)

  const handleButtonPress = (id: number) => {
    navigation.navigate('RecordStack', {
      screen: 'ReadRecord',
      params: { id },
    })
  }

  const onBookMarkPress = () => {
    console.log(`bookmark now`)
  }

  useEffect(() => {
    const fetchData = async () => {
      console.log('its start')

      try {
        const response: getCategoryDetailResponseType = await getCategoryDetail({
          type: route.params.type,
          placeId: route.params.id,
        })

        setData(response)
      } catch (err: any) {
        console.log(`error: ${err}`)
      }
    }

    void fetchData()
  }, [route.params.id])

  return (
    <SafeScreen excludeEdges={['top']}>
      <FAB
        position={'topCenter'}
        buttonStyle="bg-white rounded-full px-5 py-2 shadow-md"
        rightAddon={<SvgIcon name="arrowRightBlack" />}
        onPress={() => handleButtonPress(route.params.id)}
      >
        여행기록 보러가기
      </FAB>

      <ScrollView className="flex-1 bg-gray-100">
        <View className="bg-white px-4 pt-4">
          <ImageCarousel images={data.imageUrl} />
        </View>

        <View className="bg-white px-5 pb-6">
          <View className="mt-2 flex-row items-center justify-between py-4">
            <Text className="flex-1 text-xl font-bold text-gray-800">{data.title}</Text>
            {/* <BookmarkButton onPress={onBookMarkPress} isBookMarked={data.isBookMarked} /> */}
            <BookmarkButton onPress={onBookMarkPress} isBookMarked={false} />
          </View>

          <View className="mb-8 flex-row flex-wrap" style={{ columnGap: 6 }}>
            {/* {data.cat2.map((item, index) => (
              <Tag key={index} category={item} />
            ))} */}
            <Tag category={data.cat2} />
          </View>

          <InfoSection title="장소 소개" content={data.content || '장소 소개'} />
          <InfoSection title="정보">
            <InfoItem icon="phone" text={data.phone || '전화번호'} isBlack={true} />
            <InfoItem
              icon="calendar"
              text={data.operatingTime || '운영시간 정보 제공 칸입니다'}
              isBlack={true}
            />
          </InfoSection>
        </View>

        <View className="mt-3 bg-white px-5 py-6">
          <View className="mb-4 h-36 w-full">
            <MapDetail geometry={{ lon: data.lng, lat: data.lat }} />
          </View>

          <InfoItem icon="marker" text={`경도: ${data.lng}, 위도: ${data.lat}`} isBlack={false} />
          <InfoItem
            icon="time"
            text={data.operatingTime || '운영시간 정보 제공 칸입니다'}
            isBlack={false}
          />
        </View>
      </ScrollView>
    </SafeScreen>
  )
}

const InfoItem: React.FC<{ icon: IconName; text: string; isBlack: boolean }> = ({
  icon,
  text,
  isBlack,
}) => (
  <View className="flex-row items-center py-1">
    <SvgIcon name={icon} size={16} className={`${isBlack ? 'text-black' : 'text-neutral-400'}`} />
    <Text className={`ml-2 text-sm ${isBlack ? 'text-black' : 'text-neutral-500'}`}>{text}</Text>
  </View>
)

const InfoSection: React.FC<{ title: string; content?: string; children?: React.ReactNode }> = ({
  title,
  content,
  children,
}) => (
  <View className="mb-6">
    <Text className="mb-4 text-lg font-semibold text-gray-700">{title}</Text>
    <View className="w-full rounded-xl bg-[#BECCE8] p-4">
      {content ? <Text className="text-sm text-black">{content}</Text> : children}
    </View>
  </View>
)
