import { useMutation } from '@tanstack/react-query'

import { CategoryType } from '@/constants'
import { InterestsSchema } from '@/types/schemas/user'

import { instance } from './instance'

type searchPlaceProps = {
  query?: string
  offset?: string
  limit?: string
}

/**
 * 검색어를 기반으로 맛집 또는 관광지를 검색합니다.
 * @param query - 검색어
 * @param offset - 데이터의 시작점
 * @param limit - 한 번에 가져올 데이터 크기
 * @returns
 */
const getSearchPlace = async (params: searchPlaceProps) =>
  await instance('kkilogbu/').get('place/search', { searchParams: params }).json()

type getRecordProps = {
  lat: number
  lng: number
  level: string
}

type getRecordResponseType = {
  id: number
  imageUrl: string
  lat: number
  lng: number
}

/**
 * 사용자가 지정한 줌 레벨에 따라 기록을 조회합니다. 줌 레벨이 낮을수록 더 넓은 범위에서 데이터를 조회하고, 줌 레벨이 높을수록 좁은 범위에서 데이터를 조회합니다.
 * @param lat - 위도
 * @param lng - 경도
 * @level level - 줌 레벨
 * @returns
 */
const getRecord = async (params: getRecordProps): Promise<getRecordResponseType[]> =>
  await instance('kkilogbu/').get('record', { searchParams: params }).json()

type postBlockUserProps = {
  markId: string
}

/**
 * 사용자를 차단합니다.
 * @param params - 사용자 식별자
 * @returns
 */
const postBlockUser = async (params: postBlockUserProps) =>
  await instance('kkilogbu/')
    .post(`record/${params.markId}` + '/report')
    .json()

type postBookmarkRecordProps = {
  markId: string
}

/**
 * 기록을 즐겨찾기에 추가합니다.
 * @param markId - 기록 식별자
 * @returns
 */
const postBookmarkRecord = async (params: postBookmarkRecordProps) =>
  await instance('kkilogbu/')
    .post(`record/${params.markId}` + '/bookmark')
    .json()

type delBookmarkRecordProps = {
  markId: string
}

/**
 * 기록 즐겨찾기를 삭제합니다.
 * @param markId - 기록 식별자
 * @returns
 */
const delBookmarkRecord = async (params: delBookmarkRecordProps) =>
  await instance('kkilogbu/')
    .delete(`record/${params.markId}` + '/boomark')
    .json()

type delRecordProps = {
  markId: string
}

/**
 * 기록을 삭제합니다.
 * @param markId - 기록 식별자
 * @returns
 */
const delRecord = async (params: delRecordProps) =>
  await instance('kkilogbu/').delete(`record/${params.markId}`).json()

type patchRecordProps = {
  markId: string
  lat: number
  lng: number
  title: string
  content: string
  imageUrl: string
}

/**
 * 기록을 업데이트합니다.
 * @param params - 업데이트할 기록 정보
 * @returns
 */
const patchRecord = async (params: patchRecordProps) =>
  await instance('kkilogbu/').patch(`record/${params.markId}`, { json: params }).json()

type postBookmarkPlaceProps = {
  placeId: number
}

/**
 * 장소를 즐겨찾기에 추가합니다.
 * @param placeId - 장소 식별자
 * @returns
 */
const postBookmarkPlace = async (params: postBookmarkPlaceProps) =>
  await instance('kkilogbu/').post(`place/${params.placeId}/boomark`).json()

type delBookmarkPlaceProps = {
  placeId: number
}

/**
 * 장소를 즐겨찾기에서 삭제합니다.
 * @param placeId - 장소 식별자
 * @returns
 */
const delBookmarkPlace = async (params: delBookmarkPlaceProps) =>
  await instance('kkilogbu/').delete(`place/${params.placeId}/boomark`).json()

type getCategoryProps = {
  lat: number
  lng: number
  level: string
  restaurantCategories: string
  touristCategories: string
}

type getCategoryResponseType = {
  id: number
  lat: number
  lng: number
  imageUrl: string[]
  category: string
}

/**
 * 카테고리 정보를 가져옵니다.
 * @param lat - 위도
 * @param lng - 경도
 * @param level - 레벨
 * @param restaurantCategories - 음식점 카테고리
 * @param touristCategories - 관광지 카테고리
 * @returns
 */
const getCategory = async (params: getCategoryProps): Promise<getCategoryResponseType[]> =>
  await instance('kkilogbu/').get('place', { searchParams: params }).json()

type getCategoryDetailProps = {
  type: string
  placeId: number
}

type getCategoryDetailResponseType = {
  id: number
  title: string
  content: string
  imageUrl: [string]
  imageUrl2: string
  address: string
  addressDetail: string
  zipcode: string
  lat: number
  lng: number
  cat1: string
  cat2: CategoryType
  operatingTime: string
  phone: string
}

/**
 * 카테고리 상세 정보를 가져옵니다.
 * @param type - 타입
 * @param placeId - 장소 식별자
 * @returns
 */
const getCategoryDetail = async (
  params: getCategoryDetailProps,
): Promise<getCategoryDetailResponseType> =>
  await instance('kkilogbu/').get(`place/${params.type}/${params.placeId}`).json()

const getUser = async () => await instance('kkilogbu/').get('user').json()

type postUserProps = {
  id: number
  username: string
  nickname: string
}

/**
 * 사용자 정보를 생성합니다.
 * @param id - 사용자 ID
 * @param username - 사용자명
 * @param nickname - 닉네임
 * @returns
 */
const postUser = async (params: postUserProps) =>
  await instance('kkilogbu/').post('user', { json: params }).json()

type postAppleSignInProps = {
  authorizationCode: string
  identityToken: string
}

/**
 * 애플 로그인을 처리합니다.
 * @param authorizationCode - 인가 코드
 * @param identityToken - 식별 토큰
 * @returns
 */
const postAppleSignIn = async (params: postAppleSignInProps) =>
  await instance('kkilogbu/').post(`user/signin/apple`, { json: params }).json()

type postDuplicatedCheckProps = {
  nickname: string
}

/**
 * 닉네임 중복 확인을 요청합니다.
 * @param nickname - 사용자 닉네임
 * @returns
 */
const postDuplicatedCheck = async (params: postDuplicatedCheckProps) =>
  await instance('kkilogbu/').post('user/name/check', { json: params }).json()

type postCategoryProps = {
  category: number
}

/**
 * 카테고리를 추가합니다.
 * @param category - 카테고리 번호
 * @returns
 */
const postCategory = async (params: postCategoryProps) =>
  await instance('kkilogbu/').post('user/category', { json: params }).json()

type getUserRecordProps = {
  page: number
  size: number
  sort: string
}

type getWrapUserRecordProps<T> = {
  pageable: T
}

/**
 * 사용자의 기록을 가져옵니다.
 * @param page - 페이지 번호
 * @param size - 페이지 크기
 * @param sort - 정렬
 * @returns
 */
const getUserRecord = async (params: getWrapUserRecordProps<getUserRecordProps>) =>
  await instance('kkilogbu/').get('user/record', { searchParams: params.pageable }).json()

type getUserBookmarkProps = {
  page: number
  size: number
  sort: string
}

type getWrapUserBookmarkProps<T> = {
  pageable: T
}

/**
 * 사용자의 즐겨찾기를 가져옵니다.
 * @param page - 페이지 번호
 * @param size - 페이지 크기
 * @param sort - 정렬
 * @returns
 */
const getUserBookmark = async (params: getWrapUserBookmarkProps<getUserBookmarkProps>) =>
  await instance('kkilogbu/').get('user/bookmark', { searchParams: params.pageable }).json()

type delUserProps = {
  userId: number
  accessToken: string
}

/**
 * 사용자 정보를 삭제합니다.
 * @param userId - 사용자 ID
 * @param accessToken - 액세스 토큰
 * @returns
 */
const delUser = async (params: delUserProps) =>
  await instance('kkilogbu/').delete(`user/${params.userId}`, { searchParams: params }).json()

type getToiletProps = {
  lat: number
  lng: number
  level: string
}

type getToiletResponseType = {
  toiletName: string
  latitude: number
  longitude: number
  phoneNumber: string
  openingHours: string
}

/**
 * 화장실 데이터를 가져옵니다.
 * @param lat - 위도
 * @param lng - 경도
 * @param level - 레벨
 * @returns
 */
const getToilet = async (params: getToiletProps): Promise<getToiletResponseType[]> =>
  await instance('api/').get('toiletData', { searchParams: params }).json()

type getParkingProps = {
  lat: number
  lng: number
  level: string
}

type getParkingResponseType = {
  id: number
  lat: number
  lng: number
  jibunAddr: string
  pkFm: string
  pkCnt: 0
  svcSrtTe: string
  svcEndTe: string
  tenMin: 0
  ftDay: 0
  ftMon: 0
  pkGubun: string
}

/**
 * 주차장 데이터를 가져옵니다.
 * @param lat - 위도
 * @param lng - 경도
 * @param level - 레벨
 * @returns
 */
const getParking = async (params: getParkingProps): Promise<getParkingResponseType[]> =>
  await instance('api/').get('parking', { searchParams: params }).json()

export const usePostInterest = () => {
  const { mutate } = useMutation({
    mutationFn: postInterest,
  })

  return { mutateInterest: mutate }
}

type postInterestProps = {
  allSkip: boolean
  categories: {
    touristCategories: string[]
    restaurantCategories: string[]
  }
}

const postInterest = async ({ allSkip, categories }: postInterestProps): Promise<string> => {
  return await instance('kkilogbu/')
    .post(`interests/my`, { searchParams: { allSkip: allSkip }, json: categories })
    .text()
}

export const useGetInterest = () => {
  const { mutateAsync } = useMutation({
    mutationFn: getInterest,
  })

  return mutateAsync
}

const getInterest = async () => {
  const response = await instance('kkilogbu/').get(`interests/my/get`).json()
  return InterestsSchema.parse(response)
}

export {
  getSearchPlace,
  getRecord,
  postBlockUser,
  postBookmarkRecord,
  delBookmarkRecord,
  delRecord,
  patchRecord,
  postBookmarkPlace,
  delBookmarkPlace,
  getCategory,
  getCategoryDetail,
  getUser,
  postUser,
  postAppleSignIn,
  postDuplicatedCheck,
  postCategory,
  getUserRecord,
  getUserBookmark,
  delUser,
  getToilet,
  getParking,
}
