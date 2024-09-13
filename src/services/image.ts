import { useMutation } from '@tanstack/react-query'

import { showToast } from '@/utils/toast'

import { instance } from './instance'

export type ImageAsset = {
  uri: string
  type?: string
  fileName?: string
}

type ImageType = 'post' | 'profile'

type getImageProps = {
  name: string
}

/**
 * 이미지를 가져옵니다.
 * @param name - 이름
 * @returns
 */
export const getImage = async (params: getImageProps) =>
  await instance('api/').get('image', { searchParams: params }).json()

export type PostImageProps = {
  type: ImageType
  image: ImageAsset
}
/**
 * 이미지를 업로드합니다.
 * @param type - 이미지 유형 ("post" or "profile")
 * @param image - 이미지 객체
 * @returns 업로드된 이미지의 URL
 */
export const post_image = async ({ type, image }: PostImageProps) => {
  try {
    const formData = new FormData()
    formData.append('type', type)
    formData.append('image', {
      uri: image.uri,
      type: image.type || 'image/jpeg',
      name: image.fileName || 'image.jpg',
    })
    const response = await instance('api/')
      .post('image', {
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .text()

    const path = type === 'post' ? 'postImage' : 'profileImage'

    const imageUrl = `https://busan-image-bucket.s3.ap-northeast-2.amazonaws.com/${path}${response}`

    return imageUrl
  } catch (error) {
    showToast({ text: '20mb 미만까지만 업로드 가능합니다.' })
    console.error('[ERROR] 이미지 업로드 실패:', error)
    throw error
  }
}

/** 이미지 업로드 훅입니다. */
export const useUploadImage = () => {
  const { mutateAsync } = useMutation({
    mutationFn: post_image,
  })
  return { mutateUpload: mutateAsync }
}

interface DelImageProps {
  type: ImageType
}
/**
 * 이미지를 삭제합니다.
 * @param type - 유형
 * @param name - 이름
 * @returns
 */
export const delImage = async (params: DelImageProps) =>
  await instance('api/').delete('image', { json: params }).json()
