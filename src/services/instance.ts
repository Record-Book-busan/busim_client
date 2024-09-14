import ky from 'ky'

const url = `${process.env.API_URL ? process.env.API_URL : ''}`

export const instance = (path: string) => {
  const prefixUrl = url + path

  return ky.extend({
    prefixUrl,
    headers: {
      Accept: 'application/json',
    },
    retry: 0,
  })
}

export const kakaoMap = () => {
  return ky.extend({
    prefixUrl: 'https://dapi.kakao.com/v2/local/',
    headers: {
      Accept: 'application/json',
      Authorization: `KakaoAK ${process.env.KakaoRestApiKey}`,
    },
    retry: 0,
  })
}
