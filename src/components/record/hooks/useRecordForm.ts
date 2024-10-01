import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'
import { View, ScrollView, TextInput, findNodeHandle, Alert } from 'react-native'

import { useNavigateWithPermissionCheck } from '@/hooks/useNavigationPermissionCheck'
import { RootStackParamList } from '@/types/navigation'
import { showToast } from '@/utils/toast'
import { verifyLocation } from '@/utils/validate'

import type { ImageAsset, PostImageProps } from '@/services/image'
import type { PostRecord, UpdateRecord } from '@/types/schemas/record'
import type { StackNavigationProp } from '@react-navigation/stack'
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
    name: '위치 확인 중...',
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

/**
 * 레코드 양식 상태의 유효성을 검사합니다.
 * @param state - 유효성을 검사할 양식의 현재 상태
 * @returns 에러가 있는 필드 배열 반환
 */
export const validateForm = (state: RecordFormState): FieldError[] => {
  const newErrors: FieldError[] = []
  if (!state.title) newErrors.push({ field: 0, message: '제목을 입력해주세요.' })
  if (!state.image) newErrors.push({ field: 1, message: '사진을 추가해주세요.' })
  if (!state.content) newErrors.push({ field: 2, message: '기록을 작성해주세요.' })
  return newErrors
}

/**
 * form의 특정 필드로 스크롤 합니다.
 * @param fieldIndex - 스크롤할 필드의 인덱스
 * @param scrollViewRef - ScrollView ref
 * @param fieldRefs - 필드 refs
 */
export const scrollToField = (
  fieldIndex: number,
  scrollViewRef: React.RefObject<ScrollView>,
  fieldRefs: React.MutableRefObject<Array<React.RefObject<TextInput | View>>>,
) => {
  const ref = fieldRefs.current[fieldIndex]
  if (ref?.current && scrollViewRef.current) {
    const scrollHandle = findNodeHandle(scrollViewRef.current)
    const inputHandle = findNodeHandle(ref.current)
    if (scrollHandle && inputHandle) {
      ref.current.measureLayout(scrollHandle, (_, y) => {
        scrollViewRef.current?.scrollTo({ y, animated: true })
      })
    }
    if ('focus' in ref.current) {
      ref.current.focus()
    }
  }
}

/**
 * 에러가 발생한 필드로 스크롤하고 토스트 메시지를 표시합니다.
 * @param formErrors - 에러가 발생한 필드 배열
 * @param scrollViewRef - ScrollView ref
 * @param fieldRefs - 필드 refs
 * @returns 에러가 있으면 true를 반환하고, 그렇지 않으면 false를 반환합니다
 */
export const handleFormErrors = (
  formErrors: FieldError[],
  scrollViewRef: React.RefObject<ScrollView>,
  fieldRefs: React.MutableRefObject<Array<React.RefObject<TextInput | View>>>,
): boolean => {
  if (formErrors.length > 0) {
    scrollToField(formErrors[0].field, scrollViewRef, fieldRefs)
    showToast({ text: formErrors[0].message, type: 'info' })
    return true
  }
  return false
}

/**
 * 기록 폼을 관리하기 위한 유틸리티 훅입니다.
 * @param state - 현재 폼의 상태(value)
 * @param dispatch - 상태를 업데이트하기 위한 디스패치 함수
 * @param scrollViewRef - ScrollView ref
 * @param fieldRefs - 필드 refs
 */
export const useRecordForm = (
  state: RecordFormState,
  dispatch: React.Dispatch<RecordFormAction>,
  scrollViewRef: React.RefObject<ScrollView>,
  fieldRefs: React.MutableRefObject<Array<React.RefObject<TextInput | View>>>,
) => {
  const updateRecordData = useCallback(
    (field: keyof RecordFormState, value: RecordFormState[typeof field]) => {
      dispatch({
        type: `UPDATE_${field.toUpperCase()}` as RecordFormAction['type'],
        value,
      } as RecordFormAction)
    },
    [dispatch],
  )

  const validateAndHandleErrors = useCallback(() => {
    const formErrors = validateForm(state)
    return handleFormErrors(formErrors, scrollViewRef, fieldRefs)
  }, [state, scrollViewRef, fieldRefs])

  return {
    updateRecordData,
    validateAndHandleErrors,
  }
}

/**
 * 기록 작성 폼의 유효성을 검사하고 생성하는 훅입니다.
 * @param state - 현재 폼의 상태(value)
 * @param dispatch - 상태를 업데이트하기 위한 디스패치 함수
 * @param mutateRecord - 기록 데이터 생성 요청하는 함수
 * @param mutateImage - 이미지 데이터 생성 요청하는 함수
 * @param scrollViewRef - ScrollView ref
 * @param fieldRefs - 필드 refs
 */
export const useCreateRecordForm = (
  state: RecordFormState,
  dispatch: React.Dispatch<RecordFormAction>,
  mutateRecord: UseMutateFunction<unknown, Error, PostRecord, unknown>,
  mutateImage: UseMutateAsyncFunction<string, Error, PostImageProps, unknown>,
  scrollViewRef: React.RefObject<ScrollView>,
  fieldRefs: React.MutableRefObject<Array<React.RefObject<TextInput | View>>>,
) => {
  const { updateRecordData, validateAndHandleErrors } = useRecordForm(
    state,
    dispatch,
    scrollViewRef,
    fieldRefs,
  )
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'MainTab'>>()
  const { navigateWithPermissionCheck } = useNavigateWithPermissionCheck()

  const handleSubmit = useCallback(async () => {
    if (validateAndHandleErrors()) return

    try {
      const isValid = await verifyLocation(state.location)
      if (!isValid) {
        Alert.alert('서비스 지역이 아닙니다', '부산 지역에서만 서비스가 제공됩니다.', [
          { text: '확인', style: 'default' },
        ])
        return
      }

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
        address: state.location.name,
      }

      mutateRecord(postRecord, {
        onSuccess: () => {
          showToast({ text: '기록을 업로드했어요', type: 'info' })
          dispatch({ type: 'RESET_FORM' })
          navigateWithPermissionCheck({
            navigation,
            routeName: 'MainTab',
            params: {
              screen: 'Record',
              params: {
                screen: 'RecordMain',
                params: { tab: 1 }, // 피드로 이동
              },
            },
          })
        },
        onError: err => {
          showToast({ text: '기록 업로드가 실패했어요', type: 'info' })
          console.error('[ERROR] 기록 저장 실패:', err)
        },
      })
    } catch (err) {
      const error = err instanceof Error ? err : new Error('알수 없는 에러 발생!')
      console.error('[ERROR] 기록 저장 프로세스 에러:', error.message)
    }
  }, [state, mutateRecord, mutateImage, validateAndHandleErrors, dispatch])

  return {
    updateRecordData,
    handleSubmit,
  }
}

/**
 * 기록 편집 폼의 유효성을 검사하고 업데이트하는 훅입니다.
 * @param state - 현재 폼의 상태(value)
 * @param dispatch - 상태를 업데이트하기 위한 디스패치 함수
 * @param mutateUpdate - 기록 데이터 업데이트 요청하는 함수
 * @param mutateImage - 이미지 데이터 생성 요청하는 함수
 * @param scrollViewRef - ScrollView ref
 * @param fieldRefs - 필드 refs
 * @param recordId
 */
export const useEditRecordForm = (
  state: RecordFormState,
  dispatch: React.Dispatch<RecordFormAction>,
  mutateUpdate: UseMutateFunction<unknown, Error, UpdateRecord, unknown>,
  mutateImage: UseMutateAsyncFunction<string, Error, PostImageProps, unknown>,
  scrollViewRef: React.RefObject<ScrollView>,
  fieldRefs: React.MutableRefObject<Array<React.RefObject<TextInput | View>>>,
  recordId: number,
) => {
  const { updateRecordData, validateAndHandleErrors } = useRecordForm(
    state,
    dispatch,
    scrollViewRef,
    fieldRefs,
  )
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'MainTab'>>()
  const { navigateWithPermissionCheck } = useNavigateWithPermissionCheck()

  const handleSubmit = useCallback(async () => {
    if (validateAndHandleErrors()) return
    const isValidLocation = await verifyLocation(state.location)
    if (!isValidLocation) return

    try {
      const isValid = await verifyLocation(state.location)
      if (!isValid) {
        Alert.alert('서비스 지역이 아닙니다', '부산 지역에서만 서비스가 제공됩니다.', [
          { text: '확인', style: 'default' },
        ])
        return
      }
      if (!state.image) throw new Error('이미지 없음!')

      showToast({ text: '이미지 업로드 중...', type: 'info' })
      const uploadedImageUrl = await mutateImage({
        type: 'post',
        image: { uri: state.image.uri, fileName: state.image.fileName, type: state.image.type },
      })

      const updateRecord: UpdateRecord = {
        markId: recordId,
        title: state.title,
        lat: state.location.lat,
        lng: state.location.lng,
        content: state.content,
        imageUrl: uploadedImageUrl,
      }

      mutateUpdate(updateRecord, {
        onSuccess: () => {
          showToast({ text: '기록을 변경했어요.', type: 'info' })
          navigateWithPermissionCheck({
            navigation,
            routeName: 'MainTab',
            params: {
              screen: 'Record',
              params: {
                screen: 'ReadRecord',
                params: { id: recordId },
              },
            },
          })
        },
        onError: err => {
          showToast({ text: '기록 변경이 실패했어요.', type: 'info' })
          console.error('[ERROR] 기록 수정 실패:', err)
        },
      })
    } catch (err) {
      const error = err instanceof Error ? err : new Error('알수 없는 에러 발생!')
      console.error('[ERROR] 기록 수정 프로세스 에러:', error.message)
    }
  }, [state, mutateUpdate, mutateImage, validateAndHandleErrors, recordId])

  return {
    updateRecordData,
    handleSubmit,
  }
}
