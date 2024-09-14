/* eslint-disable @typescript-eslint/no-unused-vars */
import { Image, ScrollView, Text, View } from 'react-native'
import Lightbox from 'react-native-lightbox-v2'

import { window } from '@/constants'
import { useLocationToAddr, useRecordDetail } from '@/services/record'
import { SvgIcon } from '@/shared'
import { formatAddress } from '@/utils/format'

const { width } = window

export function RecordDetailContent({ id }: { id: number }) {
  // const { data: record } = useRecordDetail(id)
  const { data: locationData } = useLocationToAddr(record.lat, record.lng)
  const address = formatAddress(locationData)

  return (
    <ScrollView className="flex-1">
      {/* 이미지 */}
      <View style={{ width, height: width }}>
        <Lightbox
          activeProps={{
            style: { width: '100%', height: '100%' },
            resizeMode: 'contain',
          }}
        >
          <Image source={{ uri: record.imageUrl }} className="h-full w-full" />
        </Lightbox>
      </View>

      <View className="p-4">
        {/* 위치 정보 */}
        <View className="mb-4 flex-row items-center">
          <SvgIcon name="marker" size={16} className="mr-3 text-neutral-400" />
          <Text className="text-sm text-gray-500">{address.fullAddress}</Text>
        </View>
        {/* 내용 */}
        <Text className="mb-6 text-base text-gray-700">{record.content}</Text>
      </View>
    </ScrollView>
  )
}

// FIXME: API 에러 해결 후 제거!!
const record = {
  id: 1,
  title: '2일차 부산 여행 기록',
  content:
    '오늘 하루 일정 공유함댜~\n해운대에서 놀기\n서면에서 놀기\n센텀시티가서 백화점 구경 옷 아이쇼핑 🤩\n밤에 수변공원가서 맥주 ^.^\n부산 잘 즐긴거 맞쥬? ㅎㅎ',
  imageUrl:
    'https://static.hubzum.zumst.com/hubzum/2023/10/26/16/85a476ce6ecf4e038ca4e9b338c0e0ee.jpeg',
  // address: '부산광역시 광안리 해수욕장',
  // addressDetail: '20길 80-3',
  // zipCode: '99001',
  lat: 35.1587483754248,
  lng: 129.146583377665,
  // cat1: 'RECORD',
  // cat2: [CATEGORY.관광지, CATEGORY.레포츠, CATEGORY.맛집],
  createdAt: '2023-09-01T12:00:00',
}
