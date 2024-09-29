import { useMutation, useQueryClient } from '@tanstack/react-query'

import { post_image } from '@/services/image'
import { post_profile_img } from '@/services/user'
import { showToast } from '@/utils/toast'

import type { UserInfo } from '@/types/schemas/user'

type ProfileImageUpdateParams = {
  image: {
    uri: string
    type?: string
    fileName?: string
  }
  isDefault?: boolean
}

export const useProfileImageUpdate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ image, isDefault = false }: ProfileImageUpdateParams) => {
      let uploadedImageUrl: string

      if (isDefault) {
        // 기본 이미지 사용 시
        uploadedImageUrl = image.uri
      } else {
        // 갤러리에서 선택한 이미지 업로드 시
        uploadedImageUrl = await post_image({
          type: 'profile',
          image: {
            uri: image.uri,
            type: image.type || 'image/jpeg',
            fileName: image.fileName || 'profile.jpg',
          },
        })
      }

      // 새 프로필 url db에 저장
      await post_profile_img({ profileImage: uploadedImageUrl })

      return uploadedImageUrl
    },
    onMutate: async ({ image }) => {
      await queryClient.cancelQueries({ queryKey: ['userInfo'] })
      const previousUserInfo = queryClient.getQueryData(['userInfo'])

      queryClient.setQueryData(['userInfo'], (old: UserInfo) => ({
        ...old,
        profileImage: image.uri,
      }))

      return { previousUserInfo }
    },
    onError: (err, _, context) => {
      if (context?.previousUserInfo) {
        queryClient.setQueryData(['userInfo'], context.previousUserInfo)
      }
      showToast({ text: '프로필 업데이트가 실패했어요.' })
      console.error('[ERROR] 프로필 업데이트 실패:', err)
    },
    onSuccess: newImageUrl => {
      queryClient.setQueryData(['userInfo'], (old: UserInfo) => ({
        ...old,
        profileImage: newImageUrl,
      }))
      showToast({ text: '프로필을 저장했어요.' })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userInfo'] })
    },
  })
}
