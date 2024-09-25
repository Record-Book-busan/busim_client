import ky from 'ky'

import { storage } from '@/utils/storage'

const url = `${process.env.API_URL ? process.env.API_URL : ''}`

interface kyExtendProps {
  prefixUrl: string
  headers: {
    Accept: string
    Authorization?: string
  }
}

const kyExtend = ({ prefixUrl, headers }: kyExtendProps) =>
  ky.extend({
    prefixUrl,
    headers,
    retry: 0,
    hooks: {
      beforeRequest: [
        request => {
          console.log('Request:', request.url)
        },
      ],
      afterResponse: [
        (request, options, response) => {
          if (!response.ok) {
            console.error('kyExtend afterResponse Error:', response.statusText)
          }
        },
      ],
      beforeError: [
        error => {
          console.error('kyExtend beforeError Error:', error)

          return error
        },
      ],
    },
  })

export const getAuthorization = () => storage.getString('accessToken')

export const instance = (path: string) => {
  const prefixUrl = url + path

  return kyExtend({
    prefixUrl: prefixUrl,
    headers: {
      Accept: 'application/json',
      Authorization: getAuthorization(),
    },
  })
}

export const kakaoMap = () => {
  return kyExtend({
    prefixUrl: 'https://dapi.kakao.com/v2/local/',
    headers: {
      Accept: 'application/json',
      Authorization: `KakaoAK ${process.env.KakaoRestApiKey}`,
    },
  })
}
