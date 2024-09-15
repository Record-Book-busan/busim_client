import { ScrollView, Text, View } from 'react-native'

import { type PlaceType, usePlaceDetail } from '@/services/place'
import { SvgIcon, type IconName } from '@/shared'

import { ImageCarousel } from '../common'
import MapDetail from './MapDetail'

interface MapDetailContentProps {
  id: number
  type: PlaceType
}

export function MapDetailContent({ id, type }: MapDetailContentProps) {
  const { data } = usePlaceDetail(id, type)

  console.log(type)

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="bg-white px-4 pt-4">
        <ImageCarousel images={data.imageUrl || data.imageUrl2} />
      </View>

      <View className="bg-white px-5 pb-6">
        <View className="mt-2 flex-row items-center justify-between py-4">
          <Text className="flex-1 text-xl font-bold text-gray-800">{data.title}</Text>
        </View>

        <View className="mb-8 flex-row flex-wrap" style={{ columnGap: 6 }}>
          {/* <Tag category={data.cat2} /> */}
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
  )
}

const InfoItem = ({ icon, text, isBlack }: { icon: IconName; text: string; isBlack: boolean }) => (
  <View className="flex-row items-center py-1">
    <SvgIcon name={icon} size={16} className={`${isBlack ? 'text-black' : 'text-neutral-400'}`} />
    <Text className={`ml-2 text-sm ${isBlack ? 'text-black' : 'text-neutral-500'}`}>{text}</Text>
  </View>
)

const InfoSection = ({
  title,
  content,
  children,
}: {
  title: string
  content?: string
  children?: React.ReactNode
}) => (
  <View className="mb-6">
    <Text className="mb-4 text-lg font-semibold text-gray-700">{title}</Text>
    <View className="w-full rounded-xl bg-[#BECCE8] p-4">
      {content ? <Text className="text-sm text-black">{content}</Text> : children}
    </View>
  </View>
)
