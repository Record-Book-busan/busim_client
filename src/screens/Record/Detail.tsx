import { useRoute, type RouteProp } from '@react-navigation/native'
import { Suspense } from 'react'
import { Text } from 'react-native'

import { SafeScreen } from '@/components/common'
import { RecordDetailContent } from '@/components/record'
import { useRecordDetail } from '@/services/record'
import { Header } from '@/shared'

import type { RecordStackParamList } from '@/types/navigation'

type RecordDetailRouteProp = RouteProp<RecordStackParamList, 'ReadRecord'>

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

function RecordDetailHeader({ id }: { id: number }) {
  const { data: record } = useRecordDetail(id)

  return <Header title={record.title} />
}
