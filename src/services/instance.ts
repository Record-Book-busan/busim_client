import ky from 'ky'
import { Alert } from 'react-native'

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
            Alert.alert(
              'API 요청이 실패했습니다.',
              `에러코드: ${response.status} ${response.statusText}`,
            )
            console.error('Response Error:', response.statusText)
          }
        },
      ],
      beforeError: [
        error => {
          Alert.alert(
            'API 요청이 실패했습니다.',
            `에러코드 ${error?.response.status || 'Unknown'}: ${error?.response.statusText || 'Unknown error'}`,
          )
          console.error(error)

          return error
        },
      ],
    },
  })

export const instance = (path: string) => {
  const prefixUrl = url + path

  return kyExtend({
    prefixUrl: prefixUrl,
    headers: {
      Accept: 'application/json',
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
