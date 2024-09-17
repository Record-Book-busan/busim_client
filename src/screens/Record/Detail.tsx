import {
  useNavigation,
  useRoute,
  type NavigationProp,
  type RouteProp,
} from '@react-navigation/native'
import { Suspense } from 'react'
import { Text, TouchableOpacity } from 'react-native'

import { SafeScreen } from '@/components/common'
import { RecordDetailContent } from '@/components/record'
import { useRecordDetail } from '@/services/record'
import { SvgIcon, Header } from '@/shared'

import type { RecordStackParamList, RootStackParamList } from '@/types/navigation'

type RecordDetailRouteProp = RouteProp<RecordStackParamList, 'ReadRecord'>
type RecordDetailNavigationProps = NavigationProp<RootStackParamList>

export default function RecordDetailScreen() {
  const route = useRoute<RecordDetailRouteProp>()
  const { id } = route.params

  return (
    <SafeScreen>
      {/* 헤더 */}
      <RecordDetailHeader id={id} />
      <Suspense fallback={<Text>기록 상세 내용 불러오는 중...</Text>}>
        <RecordDetailContent id={id} />
      </Suspense>
    </SafeScreen>
  )
}

// 데이터 패칭 후 헤더를 표시하기 위해 별도로 분리
function RecordDetailHeader({ id }: { id: number }) {
  const navigation = useNavigation<RecordDetailNavigationProps>()
  const { data: record } = useRecordDetail(id)

  return (
    <Header
      title={record.title}
      rightContent={
        <TouchableOpacity
          className="m-0 p-0"
          onPress={() =>
            navigation.navigate('CreateRecordStack', {
              screen: 'EditRecord',
              params: { id },
            })
          }
        >
          <SvgIcon name="edit" className="text-gray-800" width={18} height={18} />
        </TouchableOpacity>
      }
    />
  )
}
