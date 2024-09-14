import {
  type NavigationProp,
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import Lightbox from 'react-native-lightbox-v2'

import { SafeScreen, Tag } from '@/components/common'
import { CATEGORY } from '@/constants'
import { getRecordDetail, getLocationToAddr } from '@/services/service'
import { SvgIcon, Header } from '@/shared'

import type { RecordStackParamList } from '@/types/navigation'

type RecordDetailRouteProp = RouteProp<RecordStackParamList, 'ReadRecord'>
type RecordDetailNavigationProps = NavigationProp<RecordStackParamList, 'ReadRecord'>

const { width } = Dimensions.get('window')

type getRecordDetailResponseType = {
  id: number
  title: string
  content: string
  imageUrl: string
  lat: number
  lng: number
  createdAt: string
}

type RoadAddress = {
  address_name: string
  region_1depth_name: string
  region_2depth_name: string
  region_3depth_name: string
  road_name: string
  underground_yn: string
  main_building_no: string
  sub_building_no: string
  building_name: string
  zone_no: string
}

type Address = {
  address_name: string
  region_1depth_name: string
  region_2depth_name: string
  region_3depth_name: string
  mountain_yn: string
  main_address_no: string
  sub_address_no: string
  zip_code: string
}

type Document = {
  road_address: RoadAddress
  address: Address
}

type getLocationToAddrResponseType = {
  meta: {
    total_count: number
  }
  documents: Document[]
}

const mockData = {
  id: 1302,
  title: '2일차 부산 여행 기록',
  content:
    '오늘 하루 일정 공유함댜~\n해운대에서 놀기\n서면에서 놀기\n센텀시티가서 백화점 구경 옷 아이쇼핑 🤩\n밤에 수변공원가서 맥주 ^.^\n부산 잘 즐긴거 맞쥬? ㅎㅎ',
  imageUrl:
    'https://static.hubzum.zumst.com/hubzum/2023/10/26/16/85a476ce6ecf4e038ca4e9b338c0e0ee.jpeg',
  address: '부산광역시 광안리 해수욕장',
  addressDetail: '20길 80-3',
  zipCode: '99001',
  lat: 39.123123,
  lng: 123.123123,
  cat1: 'RECORD',
  cat2: [CATEGORY.관광지, CATEGORY.레포츠, CATEGORY.맛집],
  nickName: '신나는 여행자',
  createdAt: '20240813154033',
}

export default function RecordDetailScreen() {
  const route = useRoute<RecordDetailRouteProp>()
  const navigation = useNavigation<RecordDetailNavigationProps>()
  const [data, setData] = useState<getRecordDetailResponseType>(mockData)
  const [addr, setAddr] = useState<{
    address: string
    addressDetail: string
    zipCode: string
  }>(mockData)

  const { id } = route.params

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: getRecordDetailResponseType = await getRecordDetail({
          markId: route.params.id,
        })

        const response2: getLocationToAddrResponseType = await getLocationToAddr({
          x: response.lng,
          y: response.lat,
        })

        const address: string = `${response2.documents[0]?.address.region_1depth_name} ${response2.documents[0]?.address.region_2depth_name} ${response2.documents[0]?.address.region_3depth_name}`
        const addressDetail: string =
          response2.documents[0]?.address.mountain_yn === 'Y'
            ? `산 ${response2.documents[0].address?.main_address_no}-${response2.documents[0].address?.sub_address_no}`
            : `${response2.documents[0].address?.main_address_no}-${response2.documents[0].address?.sub_address_no}`
        const zipCode = response2.documents[0]?.address.zip_code
          ? response2.documents[0].address.zip_code
          : response2.documents[0].road_address?.zone_no

        setData(response)
        setAddr({
          address: address,
          addressDetail: addressDetail,
          zipCode: zipCode || '우편 번호가 없습니다.',
        })
      } catch (err: any) {
        console.log(`error: ${err}`)
      }
    }

    void fetchData()
  }, [route.params.id])

  return (
    <SafeScreen>
      {/* 헤더 */}
      <Header
        title={data.title}
        rightContent={
          <TouchableOpacity
            className="m-0 p-0"
            onPress={() => navigation.navigate('EditRecord', { id })}
          >
            <SvgIcon name="edit" className="text-gray-800" width={18} height={18} />
          </TouchableOpacity>
        }
      />

      <ScrollView className="flex-1">
        {/* 이미지 */}
        <View style={{ width: width, height: width }}>
          <Lightbox
            activeProps={{
              style: {
                width: '100%',
                height: '100%',
              },
              resizeMode: 'contain',
            }}
          >
            <Image source={{ uri: data.imageUrl }} className="h-full w-full" />
          </Lightbox>
        </View>

        <View className="p-4">
          {/* 위치 정보 */}
          <View className="mb-4 flex-row items-center">
            <View className="flex-row items-center">
              <SvgIcon name="marker" size={16} className="mr-3 text-neutral-400" />
              <Text className="text-sm text-gray-500">
                {addr.address + ' ' + addr.addressDetail}
              </Text>
            </View>
          </View>

          {/* 태그 */}
          <View className="mb-4 flex-row flex-wrap" style={{ columnGap: 8, rowGap: 8 }}>
            {mockData.cat2.map((item, index) => (
              <Tag key={index} category={item} />
            ))}
          </View>

          {/* 내용 */}
          <Text className="mb-6 text-base text-gray-700">{data.content}</Text>
        </View>
      </ScrollView>
    </SafeScreen>
  )
}
