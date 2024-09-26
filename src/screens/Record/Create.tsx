import { useRef, useReducer, useEffect } from 'react'
import { ScrollView } from 'react-native'

import { KeyboardAvoidingView, SafeScreen } from '@/components/common'
import {
  RecordContent,
  RecordImage,
  RecordLocation,
  RecordSubmitButton,
  RecordTitle,
  useCreateRecordForm,
  useCurrentLocationToAddr,
} from '@/components/record'
import { initialState, recordFormReducer } from '@/components/record'
import { useAutoFocus } from '@/hooks/useAutoFocus'
import { useUploadImage } from '@/services/image'
import { useCreateRecord } from '@/services/record'
import { Header } from '@/shared'
import { showToast } from '@/utils/toast'

export default function RecordCreateScreen() {
  const scrollViewRef = useRef<ScrollView>(null)
  const { inputRefs, focusNextInput } = useAutoFocus(4)
  const { mutateRecord } = useCreateRecord()
  const { mutateUpload } = useUploadImage()
  const { getCurrentAddress, isLoading: isLocationLoading } = useCurrentLocationToAddr()

  const [state, dispatch] = useReducer(recordFormReducer, initialState)

  const { updateRecordData, handleSubmit } = useCreateRecordForm(
    state,
    dispatch,
    mutateRecord,
    mutateUpload,
    scrollViewRef,
    inputRefs,
  )

  useEffect(() => {
    void getCurrentAddress()
      .then(location => {
        dispatch({ type: 'UPDATE_LOCATION', value: location })
      })
      .catch(_ => {
        showToast({ text: '현재 위치를 불러오는데 실패했습니다. 다시 시도해주세요.' })
      })
  }, [])

  return (
    <SafeScreen>
      <Header title="여행 기록 쓰기" />
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
          <RecordLocation
            location={state.location}
            dispatch={dispatch}
            isLoading={isLocationLoading}
          />
          <RecordImage
            uri={state.image?.uri}
            onImageSelected={uri => updateRecordData('image', uri)}
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
    </SafeScreen>
  )
}
