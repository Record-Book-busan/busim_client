import { type RouteProp } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { ImageURISource, ScrollView, View } from 'react-native'

import { ImageCarousel, SafeScreen, Tag } from '@/components/common'
import { MapDetail } from '@/components/map'
import { useAnimatedHeader } from '@/hooks/useAnimatedHeader'
import { validateImageUris } from '@/services/image'
import { useSearchDetail } from '@/services/search'
import { AnimatedHeader, SvgIcon, Typo, type IconName } from '@/shared'
import { isRestaurant, isTourist } from '@/types/guards/is'
import { SearchDetail } from '@/types/schemas/place'

import type { SearchStackParamList } from '@/types/navigation'

interface DetailScreenProps {
  route: RouteProp<SearchStackParamList, 'Detail'>
}

export default function DetailScreen({ route }: DetailScreenProps) {
  const { id, type } = route.params
  const { data } = useSearchDetail(type, id)
  const [imageUris, setImageUris] = useState<ImageURISource[]>([])

  const { scrollY, handleScroll } = useAnimatedHeader()

  useEffect(() => {
    const fetchImageUris = async () => {
      const validImageUris = await getImageUrl(data)
      setImageUris(validImageUris)
    }

    fetchImageUris()
  }, [data])

  return (
    <SafeScreen>
      <AnimatedHeader
        title={data.title || '장소명 미제공'}
        scrollY={scrollY}
        triggerPoint={190}
        initialBackgroundColor="transparent"
        finalBackgroundColor="white"
      />
      <ScrollView
        className="flex-1 bg-gray-100"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: 0 }}
      >
        <View className="w-full bg-white">
          <ImageCarousel images={imageUris} />
        </View>

        <View className="bg-white px-4 pb-6">
          <View className="mt-1 flex-row items-center py-4">
            <Typo className="font-SemiBold text-xl text-gray-800">
              {data.title || '장소명 미제공'}
            </Typo>
            {isRestaurant(data) && (
              <Typo className="ml-1.5 font-Light text-base leading-tight text-neutral-400">
                {data.businessType}
              </Typo>
            )}
          </View>

          <View className="mb-8 flex-row flex-wrap" style={{ columnGap: 6 }}>
            {isTourist(data) ? (
              <Tag category={data.touristCat2} />
            ) : (
              data.restaurantCat2.map(
                (cat, index) => cat.length > 0 && <Tag key={index} category={cat} />,
              )
            )}
          </View>

          {data.report && (
            <View className="mb-6">
              <Typo className="mb-3 font-Medium text-lg text-gray-700">장소 소개</Typo>
              <InfoSection content={data.report || ''} />
            </View>
          )}
          <Typo className="mb-3 font-Medium text-lg text-gray-700">정보</Typo>
          <InfoSection>
            <InfoItem icon="marker" text={data.address} />
            {data.phoneNumber && (
              <InfoItem icon="phone" text={data.phoneNumber || '전화번호 미제공'} />
            )}
          </InfoSection>
        </View>

        <View className="mt-3 bg-white px-4 py-6">
          <Typo className="mb-3 font-Medium text-lg text-gray-700">지도</Typo>
          <View className="mb-4 h-40 w-full overflow-hidden rounded-xl">
            <MapDetail
              title={data.title || '장소명 미제공'}
              geometry={{ lon: data.lng, lat: data.lat }}
            />
          </View>
          <InfoItem icon="marker" text={data.address} />
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
  <View className="w-full rounded-xl bg-BUSIM-slate-light py-3 pl-3 pr-6">
    {content ? <Typo className="text-[15px] leading-6 text-gray-700">{content}</Typo> : children}
  </View>
)

async function getImageUrl(detail: SearchDetail): Promise<ImageURISource[]> {
  let imageUrls: string[] = []

  if (isTourist(detail)) {
    imageUrls = [detail.imageUrl2]
  } else if (isRestaurant(detail)) {
    imageUrls = detail.imageUrl
  }

  const validImageUrls = await validateImageUris(imageUrls)

  return validImageUrls
}
