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
