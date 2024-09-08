import {
  type NavigationProp,
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native'
import { useState } from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageURISource,
} from 'react-native'

import { SafeScreen, Tag } from '@/components/common'
import { SvgIcon, Header } from '@/shared'

import type { RecordStackParamList } from '@/types/navigation'

type RecordDetailRouteProp = RouteProp<RecordStackParamList, 'ReadRecord'>
type RecordDetailNavigationProps = NavigationProp<RecordStackParamList, 'ReadRecord'>

const { width } = Dimensions.get('window')
const IMAGE_SIZE = width

export default function RecordDetailScreen() {
  const route = useRoute<RecordDetailRouteProp>()
  const navigation = useNavigation<RecordDetailNavigationProps>()

  const { id } = route.params

  const [imageHeight, setImageHeight] = useState(IMAGE_SIZE)

  const onImageLoad = (event: { nativeEvent: { source: ImageURISource } }) => {
    const { width: imageWidth, height: imageHeight } = event.nativeEvent.source
    if (imageWidth && imageHeight) {
      const aspectRatio = imageWidth / imageHeight
      if (aspectRatio > 1) {
        // 가로가 긴 이미지의 경우에만 높이 조정
        setImageHeight(IMAGE_SIZE * 0.8)
      }
    }
  }

  return (
    <SafeScreen>
      {/* 헤더 */}
      <Header
        title={mockData.title}
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
        <Image
          source={{ uri: mockData.imageUrl }}
          style={{ width: IMAGE_SIZE, height: imageHeight }}
          resizeMode="cover"
          onLoad={onImageLoad}
        />

        <View className="p-4">
          {/* 위치 정보 */}
          <View className="mb-4 flex-row items-center">
            <View className="flex-row items-center">
              <SvgIcon name="marker" size={16} className="mr-3 text-neutral-400" />
              <Text className="text-sm text-gray-500">
                {mockData.address + ' ' + mockData.addressDetail}
              </Text>
            </View>
          </View>

          {/* 태그 */}
          <View className="mb-4 flex-row flex-wrap" style={{ columnGap: 8, rowGap: 8 }}>
            {mockData.cat2.map((item, index) => (
              <Tag key={index} catId={item} />
            ))}
          </View>

          {/* 내용 */}
          <Text className="mb-6 text-base text-gray-700">{mockData.content}</Text>
        </View>
      </ScrollView>
    </SafeScreen>
  )
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
  zipcode: '99001',
  lat: 39.123123,
  lng: 123.123123,
  cat1: 'RECORD',
  cat2: [2, 4, 8],
  nickName: '신나는 여행자',
  createdAt: '20240813154033',
}
