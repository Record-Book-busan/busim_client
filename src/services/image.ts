import { useMutation } from '@tanstack/react-query'
import ky from 'ky'

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

export const baseUri = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'

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

/**
 * 이미지 유효성을 체크하고, 유효하지 않을 시 ImageUri를 리턴합니다.
 * @param uri - 이미지 URI
 */
export const validateImageUri = async (uri?: string): Promise<string> => {
  if (uri) {
    try {
      const response = await ky.get(uri)

      if (response.ok) {
        return uri
      } else {
        console.error('[ERROR] 유효하지 않은 이미지:', response.status)

        return baseUri
      }
    } catch (error) {
      console.error('[ERROR] 이미지 로드 실패:', error)

      return baseUri
    }
  }

  return baseUri
}

/**
 * 이미지들 유효성을 체크하고, 유효하지 않을 시 ImageUri를 리턴합니다.
 * @param uri - 이미지 URI
 */
export const validateImageUris = async (uris: string[]): Promise<string[]> => {
  const validUris: string[] = []

  for (const imageUrl of uris) {
    try {
      const response = await ky.head(imageUrl)

      if (response.ok) {
        validUris.push(imageUrl)
      } else {
        console.error('[ERROR] 유효하지 않은 이미지:', response.status)
        validUris.push(baseUri)
      }
    } catch (error) {
      console.error('[ERROR] 이미지 로드 실패:', error)
      validUris.push(baseUri)
    }
  }

  return validUris
}
