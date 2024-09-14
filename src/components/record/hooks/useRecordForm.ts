import { useCallback } from 'react'
import { ScrollView, TextInput, findNodeHandle } from 'react-native'

import { showToast } from '@/utils/toast'

import type { ImageAsset, PostImageProps } from '@/services/image'
import type { PostRecord } from '@/types/schemas/record'
import type { UseMutateAsyncFunction, UseMutateFunction } from '@tanstack/react-query'

export interface RecordFormState {
  title: string
  location: {
    name: string
    lat: number
    lng: number
  }
  content: string
  image: ImageAsset | null
}

export type RecordFormAction =
  | { type: 'UPDATE_TITLE'; value: string }
  | { type: 'UPDATE_LOCATION'; value: { name: string; lat: number; lng: number } }
  | { type: 'UPDATE_CONTENT'; value: string }
  | { type: 'UPDATE_IMAGE'; value: ImageAsset | null }
  | { type: 'RESET_FORM' }

export const initialState: RecordFormState = {
  title: '',
  location: {
    name: '현재 위치',
    lat: 0,
    lng: 0,
  },
  content: '',
  image: null,
}

export function recordFormReducer(
  state: RecordFormState,
  action: RecordFormAction,
): RecordFormState {
  switch (action.type) {
    case 'UPDATE_TITLE':
      return { ...state, title: action.value }
    case 'UPDATE_LOCATION':
      return { ...state, location: action.value }
    case 'UPDATE_CONTENT':
      return { ...state, content: action.value }
    case 'UPDATE_IMAGE':
      return { ...state, image: action.value }
    case 'RESET_FORM':
      return initialState
    default:
      return state
  }
}

export interface FieldError {
  field: number
  message: string
}

export const useRecordForm = (
  state: RecordFormState,
  dispatch: React.Dispatch<RecordFormAction>,
  mutateRecord: UseMutateFunction<unknown, Error, PostRecord, unknown>,
  mutateImage: UseMutateAsyncFunction<string, Error, PostImageProps, unknown>,
  scrollViewRef: React.RefObject<ScrollView>,
  inputRefs: React.MutableRefObject<Array<React.RefObject<TextInput>>>,
) => {
  const validateForm = useCallback((): FieldError[] => {
    const newErrors: FieldError[] = []
    if (!state.title) newErrors.push({ field: 0, message: '제목을 입력해주세요.' })
    if (!state.image) newErrors.push({ field: 1, message: '사진을 추가해주세요.' })
    if (!state.content) newErrors.push({ field: 2, message: '기록을 작성해주세요.' })
    return newErrors
  }, [state])

  const scrollToField = (fieldIndex: number) => {
    const ref = inputRefs.current[fieldIndex]
    if (ref?.current && scrollViewRef.current) {
      const scrollHandle = findNodeHandle(scrollViewRef.current)
      const inputHandle = findNodeHandle(ref.current)
      if (scrollHandle && inputHandle) {
        ref.current.measureLayout(scrollHandle, (_, y) => {
          scrollViewRef.current?.scrollTo({ y, animated: true })
        })
      }
      ref.current.focus()
    }
  }

  const updateRecordData = (field: keyof RecordFormState, value: any) => {
    switch (field) {
      case 'title':
        dispatch({ type: 'UPDATE_TITLE', value })
        break
      case 'location':
        dispatch({ type: 'UPDATE_LOCATION', value })
        break
      case 'content':
        dispatch({ type: 'UPDATE_CONTENT', value })
        break
      case 'image':
        dispatch({ type: 'UPDATE_IMAGE', value })
        break
    }
  }

  const handleSubmit = async () => {
    const formErrors = validateForm()
    if (formErrors.length > 0) {
      scrollToField(formErrors[0].field)
      showToast({ text: formErrors[0].message, type: 'info' })
    } else {
      try {
        if (!state.image) throw new Error('이미지 없음!')

        showToast({ text: '이미지 업로드 중...', type: 'info' })
        const uploadedImageUrl = await mutateImage({
          type: 'post',
          image: { uri: state.image.uri, fileName: state.image.fileName, type: state.image.type },
        })

        const postRecord: PostRecord = {
          title: state.title,
          lat: state.location.lat,
          lng: state.location.lng,
          content: state.content,
          imageUrl: uploadedImageUrl,
        }

        console.log(postRecord)
        // mutateRecord(postRecord, {
        //   onSuccess: () => {
        //     showToast({ text: '기록이 저장되었습니다.', type: 'info' })
        //     dispatch({ type: 'RESET_FORM' })
        //   },
        //   onError: err => {
        //     showToast({ text: '기록 저장에 실패했습니다.', type: 'info' })
        //     console.error('[ERROR] 기록 저장 실패:', err)
        //   },
        // })
      } catch (err) {
        const error = err instanceof Error ? err : new Error('알수 없는 에러 발생!')
        console.error('[ERROR] 기록 저장 프로세스 에러:', error.message)
      }
    }
  }

  return {
    handleSubmit,
    updateRecordData,
  }
}
