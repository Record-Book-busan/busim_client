import { useEffect, useState } from 'react'
import { View } from 'react-native'

import { CATEGORY, type CategoryKey } from '@/constants'
import { validateImageUris } from '@/services/image'
import { type PlaceType, usePlaceDetail } from '@/services/place'
import { SvgIcon, Typo, type IconName } from '@/shared'

import { ImageCarousel, Tag } from '../common'
import MapDetail from './MapDetail'

interface MapDetailContentProps {
  id: number
  type: PlaceType
}

export function MapDetailContent({ id, type }: MapDetailContentProps) {
  const { data } = usePlaceDetail(id, type)
  const [imageUris, setImageUris] = useState<string[]>([])

  const restaurantCat = formatCategoryData(data.restaurantCat2)
  const touristCat = formatCategoryData(data.touristCat2)

  useEffect(() => {
    const fetchImageUris = async () => {
      const validImageUris = await getImageUrl(
        (data.imageUrl || data.imageUrl2) as string | string[],
      )
      setImageUris(validImageUris)
    }

    fetchImageUris()
  }, [data])

  return (
    <>
      <View className="w-full bg-white">
        <ImageCarousel images={imageUris} />
      </View>

      <View className="bg-white px-4 pb-6">
        <View className="mt-1 flex-row items-center py-4">
          <Typo className="font-SemiBold text-xl text-gray-800">
            {data.title || '장소명 미제공'}
          </Typo>
          {data.businessType && (
            <Typo className="ml-1.5 font-Light text-base leading-tight text-neutral-400">
              {data.businessType}
            </Typo>
          )}
        </View>

        <View className="mb-8 flex-row flex-wrap" style={{ columnGap: 6 }}>
          {(restaurantCat || touristCat).map((item, index) => (
            <Tag key={index} category={item} />
          ))}
        </View>

        {data.report ||
          (data.content && (
            <>
              <Typo className="mb-3 font-Medium text-lg text-gray-700">장소 소개</Typo>
              <InfoSection content={data.report || data.content} />
            </>
          ))}
        <Typo className="mb-3 font-Medium text-lg text-gray-700">정보</Typo>
        <InfoSection>
          <InfoItem icon="marker" text={data.address} />
          <InfoItem icon="time" text={data.operatingTime || '운영시간 미제공'} />
          <InfoItem icon="phone" text={data.phone || '전화번호 미제공'} />
        </InfoSection>
      </View>

      <View className="mt-3 bg-white px-4 py-6">
        <Typo className="mb-3 font-Medium text-lg text-gray-700">지도</Typo>
        <View className="mb-4 h-40 w-full overflow-hidden rounded-xl">
          <MapDetail title={data.title} geometry={{ lon: data.lng, lat: data.lat }} />
        </View>
        <InfoItem icon="marker" text={data.address} />
      </View>
    </>
  )
}

const InfoItem = ({ icon, text }: { icon: IconName; text: string }) => (
  <View className="flex-row items-center py-1.5">
    <SvgIcon name={icon} size={16} className="text-BUSIM-slate" />
    <Typo className="ml-2 text-[15px] leading-5 text-gray-700">{text}</Typo>
  </View>
)

const InfoSection = ({ content, children }: { content?: string; children?: React.ReactNode }) => (
  <View className="w-full rounded-xl bg-BUSIM-slate-light px-3 py-3">
    {content ? <Typo className="text-[15px] leading-6 text-gray-700">{content}</Typo> : children}
  </View>
)

/**
 * 유효한 이미지로 반환하는 함수
 */
async function getImageUrl(uri: string | string[]): Promise<string[]> {
  let imageUrls: string[] = []

  if (Array.isArray(uri)) {
    imageUrls = uri
  } else {
    imageUrls = [uri]
  }

  const validImageUrls = await validateImageUris(imageUrls)

  return validImageUrls
}

/**
 * 유효하지 않은 카테고리 문자열을 배열로 변환하는 함수
 * @param {string} categoryStr - 변환할 카테고리 문자열
 * @returns {string[]} 변환된 카테고리 배열
 * @todo DB 수정 후 제거하심됩니다.
 */
const parseCategoryString = (categoryStr: string): string[] => {
  try {
    // 문자열이 배열 형식의 JSON이면 파싱 시도
    const parsed = JSON.parse(categoryStr.replace(/'/g, '"'))
    if (Array.isArray(parsed)) {
      return parsed as string[]
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // 파싱에 실패한 경우, 원본 문자열을 배열로 반환
    return [categoryStr]
  }

  return [categoryStr]
}

/**
 * 카테고리 데이터를 포맷팅하는 함수
 * @param {string | string[] | null | undefined} category - 처리할 카테고리 데이터
 * @returns {(string | CategoryType)[]} 포맷팅된 카테고리 배열
 */
const formatCategoryData = (category: string | string[] | null | undefined): string[] => {
  if (!category) return []
  let categoryList: string[] = []
  // 카테고리가 배열일 경우
  if (Array.isArray(category)) {
    category.forEach(cat => {
      const formattedCat = parseCategoryString(cat)
      categoryList = categoryList.concat(formattedCat)
    })
  } else {
    // 카테고리가 문자열일 경우
    categoryList = parseCategoryString(category)
  }
  return categoryList.map(cat => {
    // CATEGORY에 없는 값은 그대로 반환
    if (Object.keys(CATEGORY).includes(cat as CategoryKey)) {
      return CATEGORY[cat as CategoryKey]
    }
    return cat
  })
}
