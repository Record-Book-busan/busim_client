import { useCallback } from 'react'

import { showToast } from '@/utils/toast'

import type { ImageAsset, PostImageProps } from '@/services/image'
import type { UserInfo } from '@/types/schemas/user'
import type { UseMutateAsyncFunction, UseMutateFunction } from '@tanstack/react-query'

export interface UserInfoFormState {
  nickName: string
  image: ImageAsset | null
}

export type UserInfoFormAction =
  | { type: 'UPDATE_NICKNAME'; value: string }
  | { type: 'UPDATE_IMAGE'; value: ImageAsset | null }
  | { type: 'RESET_FORM' }

export const initialState: UserInfoFormState = {
  nickName: '',
  image: null,
}

export function userInfoFormReducer(
  state: UserInfoFormState,
  action: UserInfoFormAction,
): UserInfoFormState {
  switch (action.type) {
    case 'UPDATE_NICKNAME':
      return { ...state, nickName: action.value }
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

export const useUserInfoForm = (
  state: UserInfoFormState,
  dispatch: React.Dispatch<UserInfoFormAction>,
  mutateUserInfo: UseMutateFunction<unknown, Error, UserInfo, unknown>,
  mutateImage: UseMutateAsyncFunction<string, Error, PostImageProps, unknown>,
) => {
  const validateForm = useCallback((): FieldError[] => {
    const newErrors: FieldError[] = []
    if (!state.nickName) newErrors.push({ field: 0, message: '닉네임을 다시 확인해주세요.' })
    return newErrors
  }, [state])

  const updateUserInfoData = (field: keyof UserInfoFormState, value: any) => {
    switch (field) {
      case 'nickName':
        dispatch({ type: 'UPDATE_NICKNAME', value })
        break
      case 'image':
        dispatch({ type: 'UPDATE_IMAGE', value })
        break
    }
  }

  const handleSubmit = async () => {
    const formErrors = validateForm()
    if (formErrors.length > 0) {
      showToast({ text: formErrors[0].message, type: 'info' })
    } else {
      try {
        if (!state.image) throw new Error('이미지 없음!')

        // FIXME: 로딩 스피너 보여주기
        showToast({ text: '이미지 업로드 중...', type: 'info' })
        const imageUrl = await mutateImage({
          type: 'profile',
          image: { uri: state.image.uri, fileName: state.image.fileName, type: state.image.type },
        })

        const params = {
          nickName: state.nickName,
          profileImage: imageUrl,
        }

        console.log(params)
        mutateUserInfo(params, {
          onSuccess: () => {
            dispatch({ type: 'RESET_FORM' })
          },
          onError: err => {
            showToast({ text: '프로필 변경이 실패했습니다.', type: 'info' })
            console.error('[ERROR] 프로필 변경 실패:', err)
          },
        })
      } catch (err) {
        const error = err instanceof Error ? err : new Error('알수 없는 에러 발생!')
        console.error('[ERROR] 프로필 변경 프로세스 에러:', error.message)
      }
    }
  }

  return {
    handleSubmit,
    updateUserInfoData,
  }
}
