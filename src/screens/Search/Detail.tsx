import { type NavigationProp, type RouteProp, useNavigation } from '@react-navigation/native'
import React from 'react'
import { ScrollView, Text, View } from 'react-native'

import { BookmarkButton, ImageCarousel, SafeScreen, Tag } from '@/components/common'
import { MapDetail } from '@/components/map'
import { FAB, type IconName, SvgIcon } from '@/shared'

import type { SearchStackParamList, RootStackParamList } from '@/types/navigation'

interface DetailScreenProps {
  route: RouteProp<SearchStackParamList, 'Detail'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DetailScreen: React.FC<DetailScreenProps> = ({ route }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'SearchStack'>>()

  const moveSearchHandler = () => {
    navigation.navigate('SearchStack', {
      screen: 'Search',
      params: { keyword: 'test', selected: 'record' },
    })
  }

  const onBookMarkPress = () => {
    console.log(`bookmark now`)
  }

  return (
    <SafeScreen excludeEdges={['top']}>
      <FAB
        position={'topCenter'}
        buttonStyle="bg-white rounded-full px-5 py-2 shadow-md"
        rightAddon={<SvgIcon name="arrowRightBlack" />}
        onPress={moveSearchHandler}
      >
        여행기록 보러가기
      </FAB>

      <ScrollView className="flex-1 bg-gray-100">
        <View className="bg-white px-4 pt-4">
          <ImageCarousel images={mockData.imageUrl} />
          {/* <ImageVariant className="h-72 w-full rounded-xl" source={{ uri: mockData.imageUrl[0] }} /> */}
        </View>

        <View className="bg-white px-5 pb-6">
          <View className="mt-2 flex-row items-center justify-between py-4">
            <Text className="flex-1 text-xl font-bold text-gray-800">{mockData.title}</Text>
            <BookmarkButton onPress={onBookMarkPress} />
          </View>

          <View className="mb-4 flex-row flex-wrap" style={{ columnGap: 6 }}>
            {mockData.cat2.map((item, index) => (
              <Tag key={index} catId={item} />
            ))}
          </View>

          <View className="mb-4 h-36 w-full">
            <MapDetail geometry={{ lon: mockData.lng, lat: mockData.lat }} />
          </View>

          <InfoItem icon="marekrBorderGray" text={`경도: ${mockData.lng}, 위도: ${mockData.lat}`} />
          <InfoItem icon="time" text={mockData.operatingTime || '운영시간 정보 제공 칸입니다'} />
        </View>

        <View className="mt-3 bg-white px-5 py-6">
          <InfoSection title="장소 소개" content={mockData.content || '장소 소개'} />
          <InfoSection title="정보">
            <InfoItem icon="phone" text={mockData.phone || '전화번호'} />
            <InfoItem
              icon="calendar"
              text={mockData.operatingTime || '운영시간 정보 제공 칸입니다'}
            />
          </InfoSection>
        </View>
      </ScrollView>
    </SafeScreen>
  )
}

const InfoItem: React.FC<{ icon: IconName; text: string }> = ({ icon, text }) => (
  <View className="flex-row items-center py-1">
    <SvgIcon name={icon} size={16} className="text-neutral-400" />
    <Text className="ml-2 text-sm text-neutral-500">{text}</Text>
  </View>
)

const InfoSection: React.FC<{ title: string; content?: string; children?: React.ReactNode }> = ({
  title,
  content,
  children,
}) => (
  <View className="mb-6">
    <Text className="mb-4 text-lg font-semibold text-gray-700">{title}</Text>
    <View className="w-full rounded-xl bg-slate-100 p-4">
      {content ? <Text className="text-sm text-gray-700">{content}</Text> : children}
    </View>
  </View>
)

export default DetailScreen

const mockData = {
  id: 1,
  title: '부산 해운대 해수욕장',
  content: '한국에서 가장 유명한 해수욕장 중 하나로, 여름철 많은 사람들이 방문하는 관광지입니다.',
  imageUrl: [
    'https://picsum.photos/600/400',
    'https://picsum.photos/600/400',
    'https://picsum.photos/600/400',
    'https://picsum.photos/600/400',
  ],
  address: '부산광역시 해운대구 우동',
  addressDetail: '',
  zipcode: '48094',
  lat: 128.1603,
  lng: 36.1587,
  cat1: 'PLACE',
  cat2: [1, 4],
  operatingTime: '09:00 - 18:00 (여름 시즌)',
  phone: '051-123-4567',
}
