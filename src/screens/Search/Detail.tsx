/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NavigationProp, type RouteProp, useNavigation } from '@react-navigation/native'
import React from 'react'
import { ScrollView, View } from 'react-native'

import { ImageCarousel, SafeScreen, Tag } from '@/components/common'
import { MapDetail } from '@/components/map'
import { CATEGORY, CategoryType } from '@/constants'
import { useAnimatedHeader } from '@/hooks/useAnimatedHeader'
import { AnimatedHeader, FAB, SvgIcon, Typo, type IconName } from '@/shared'

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
  lat: 37,
  lng: 127,
  cat1: 'PLACE',
  cat2: CATEGORY.관광지,
  operatingTime: '09:00 - 18:00 (여름 시즌)',
  phone: '051-123-4567',
}

export default function DetailScreen({ route }: DetailScreenProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'SearchStack'>>()

  const navigateToRecordDetail = (id: number) => {
    navigation.navigate('RecordStack', {
      screen: 'ReadRecord',
      params: { id },
    })
  }

  const { scrollY, handleScroll } = useAnimatedHeader()

  const catArray = Array.isArray(mockData.cat2) ? mockData.cat2 : [mockData.cat2]

  return (
    <SafeScreen>
      <AnimatedHeader
        title={mockData.title}
        scrollY={scrollY}
        triggerPoint={190}
        initialBackgroundColor="transparent"
        finalBackgroundColor="white"
      />
      {/* <FAB
        position={'topCenter'}
        buttonStyle="bg-white rounded-full px-5 py-2 shadow-md"
        rightAddon={<SvgIcon name="arrowRightBlack" />}
        onPress={() => navigateToRecordDetail(route.params.id)}
      >
        여행기록 보러가기
      </FAB> */}

      <ScrollView
        className="flex-1 bg-gray-100"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: 0 }}
      >
        <View className="w-full bg-white">
          <ImageCarousel images={mockData.imageUrl} />
        </View>

        <View className="bg-white px-4 pb-6">
          <View className="mt-1 flex-row items-center justify-between py-4">
            <Typo className="flex-1 font-SemiBold text-xl text-gray-800">{mockData.title}</Typo>
          </View>

          <View className="mb-8 flex-row flex-wrap" style={{ columnGap: 6 }}>
            {catArray.map((item, index) => (
              <Tag key={index} category={item} />
            ))}
          </View>

          <View className="mb-6">
            <Typo className="mb-3 font-Medium text-lg text-gray-700">장소 소개</Typo>
            <InfoSection content={mockData.content || ''} />
          </View>
          <Typo className="mb-3 font-Medium text-lg text-gray-700">정보</Typo>
          <InfoSection>
            <InfoItem icon="marker" text={mockData.address} />
            <InfoItem icon="time" text={mockData.operatingTime || '운영시간 정보 제공 칸입니다'} />
            <InfoItem icon="phone" text={mockData.phone || '전화번호'} />
          </InfoSection>
        </View>

        <View className="mt-3 bg-white px-4 py-6">
          <Typo className="mb-3 font-Medium text-lg text-gray-700">지도</Typo>
          <View className="mb-4 h-40 w-full overflow-hidden rounded-xl">
            <MapDetail title={mockData.title} geometry={{ lon: mockData.lng, lat: mockData.lat }} />
          </View>
          <InfoItem icon="marker" text={mockData.address} />
        </View>
      </ScrollView>
    </SafeScreen>
  )
}

const InfoItem: React.FC<{ icon: IconName; text: string }> = ({ icon, text }) => (
  <View className="flex-row items-center py-1.5">
    <SvgIcon name={icon} size={16} className="text-BUSIM-slate" />
    <Typo className="ml-2 text-[15px] leading-5 text-gray-700">{text}</Typo>
  </View>
)

const InfoSection: React.FC<{ content?: string; children?: React.ReactNode }> = ({
  content,
  children,
}) => (
  <View className="w-full rounded-xl bg-BUSIM-slate-light px-3 py-3">
    {content ? <Typo className="text-[15px] leading-6 text-gray-700">{content}</Typo> : children}
  </View>
)
