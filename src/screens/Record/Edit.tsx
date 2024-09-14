/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useReducer, useEffect, Suspense } from 'react'
import { ScrollView, View, Text } from 'react-native'

import { KeyboardAvoidingView, SafeScreen } from '@/components/common'
import {
  RecordContent,
  RecordImage,
  RecordLocation,
  RecordSubmitButton,
  RecordTitle,
  useCurrentLocationToAddr,
  useEditRecordForm,
  initialState,
  recordFormReducer,
} from '@/components/record'
import { useAutoFocus } from '@/hooks/useAutoFocus'
import { useUploadImage } from '@/services/image'
import { useRecordDetail, useUpdateRecord, useLocationToAddr } from '@/services/record'
import { Header } from '@/shared'
import { formatAddress } from '@/utils/format'

interface RecordEditScreenProps {
  route: {
    params: {
      id: number
    }
  }
}

export default function RecordEditScreen({ route }: RecordEditScreenProps) {
  const { id } = route.params

  return (
    <SafeScreen>
      <Header title="여행 기록 수정" />
      <Suspense
        fallback={
          <View className="flex-1 items-center justify-center">
            <Text>여행 기록 수정 화면 로딩중...</Text>
          </View>
        }
      >
        <RecordEditContent id={id} />
      </Suspense>
    </SafeScreen>
  )
}

interface RecordEditContentProps {
  id: number
}

export function RecordEditContent({ id }: RecordEditContentProps) {
  const scrollViewRef = useRef<ScrollView>(null)
  const { inputRefs, focusNextInput } = useAutoFocus(4)
  const { mutateRecord } = useUpdateRecord()
  const { mutateUpload } = useUploadImage()
  // const { data: record } = useRecordDetail(id)

  const [state, dispatch] = useReducer(recordFormReducer, initialState)

  const { updateRecordData, handleSubmit } = useEditRecordForm(
    state,
    dispatch,
    mutateRecord,
    mutateUpload,
    scrollViewRef,
    inputRefs,
    id,
  )

  const { isLoading: isLocationLoading } = useCurrentLocationToAddr()
  const { data: locationData } = useLocationToAddr(record.lat, record.lng)

  useEffect(() => {
    if (record) {
      dispatch({ type: 'UPDATE_TITLE', value: record.title })
      dispatch({ type: 'UPDATE_CONTENT', value: record.content })
      dispatch({
        type: 'UPDATE_LOCATION',
        value: {
          name: '위치 확인 중...',
          lat: record.lat,
          lng: record.lng,
        },
      })
      dispatch({ type: 'UPDATE_IMAGE', value: record.imageUrl ? { uri: record.imageUrl } : null })
    }
  }, [record])

  useEffect(() => {
    if (locationData) {
      const address = formatAddress(locationData)
      dispatch({ type: 'UPDATE_LOCATION', value: { ...state.location, name: address.fullAddress } })
    }
  }, [locationData])

  return (
    <KeyboardAvoidingView edge="top">
      <ScrollView
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, backgroundColor: 'white' }}
        scrollEventThrottle={16}
      >
        <RecordTitle
          title={state.title}
          onChangeTitle={text => updateRecordData('title', text)}
          inputRef={inputRefs.current[0]}
          onSubmitEditing={() => focusNextInput(0)}
        />
        <RecordLocation location={state.location} isLoading={isLocationLoading} />
        <RecordImage
          uri={state.image?.uri}
          onImageSelected={image => updateRecordData('image', image)}
          inputRef={inputRefs.current[1]}
        />
        <RecordContent
          content={state.content}
          onChangeContent={text => updateRecordData('content', text)}
          inputRef={inputRefs.current[2]}
          scrollViewRef={scrollViewRef}
        />
        <RecordSubmitButton onSubmit={handleSubmit} />
      </ScrollView>
    </KeyboardAvoidingView>
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
