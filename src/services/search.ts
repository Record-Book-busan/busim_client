import { useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { ZodError } from 'zod'

import { PlaceArraySchema, PlaceSchema, SearchDetail, type Place } from '@/types/schemas/place'
import { type FeedType, FeedArraySchema } from '@/types/schemas/record'
import { storage } from '@/utils/storage'

import { instance } from './instance'
import * as service from './service'

const LIMIT = 10

export const useFeedInfiniteSearch = (query: string) => {
  return useSuspenseInfiniteQuery<FeedType[]>({
    queryKey: ['search', query],
    queryFn: ({ pageParam = 0 }) =>
      get_feed_search({ query, offset: pageParam as number, limit: LIMIT }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === LIMIT ? allPages.length * LIMIT : undefined
    },
    initialPageParam: 0,
    retryOnMount: false,
    refetchOnWindowFocus: false,
  })
}

export const usePlaceInfiniteSearch = (query: string) => {
  return useSuspenseInfiniteQuery<Place[]>({
    queryKey: ['search', query],
    queryFn: ({ pageParam = 0 }) =>
      get_place_search({ query, offset: pageParam as number, limit: LIMIT }),
    getNextPageParam: (lastPage, allPages) => {
      // 마지막으로 가져온 페이지가 limit와 동일한지 검사 -> limit와 동일하다면 더 가져올 데이터가 있다고 판단
      return lastPage.length === LIMIT ? allPages.length * LIMIT : undefined
    },
    initialPageParam: 0,
    // 마운트시에 요청 보내지 않음
    retryOnMount: false,
    // 윈도우 포커스시에 새로고침하지 않음
    refetchOnWindowFocus: false,
  })
}

export const useSearchDetail = (type: string, placeId: number) => {
  return useSuspenseQuery({
    queryKey: ['searchDetail', type, placeId],
    queryFn: () => get_search_detail({ type, placeId }),
  })
}

export const useRecentSearch = () => {
  const [recentSearches, setRecentSearches] = useState<Place[]>([])

  useEffect(() => {
    loadRecentSearches()
  }, [])

  const loadRecentSearches = () => {
    const searches = storage.getString('place_recent_searches')
    if (searches) {
      try {
        const parsedSearches = JSON.parse(searches)
        const validatedSearches = PlaceArraySchema.parse(parsedSearches)
        setRecentSearches(validatedSearches)
      } catch (error) {
        console.error('Failed to load recent searches:', error)
        storage.set('place_recent_searches', JSON.stringify([]))
      }
    }
  }

  const updateRecentSearches = (updatedSearches: Place[]) => {
    const validatedSearches = PlaceArraySchema.parse(updatedSearches)
    storage.set('place_recent_searches', JSON.stringify(validatedSearches))
    setRecentSearches(validatedSearches)
  }

  const addRecentSearch = (place: Place) => {
    try {
      const validatedPlace = PlaceSchema.parse(place)
      const updatedSearches = [
        validatedPlace,
        ...recentSearches.filter(s => s.id !== validatedPlace.id),
      ].slice(0, 5)
      updateRecentSearches(updatedSearches)
    } catch (error) {
      console.error('Failed to add recent search:', error)
    }
  }

  const removeRecentSearch = (id: number) => {
    const updatedSearches = recentSearches.filter(item => item.id !== id)
    updateRecentSearches(updatedSearches)
  }

  return {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
  }
}

/**
 * 검색어 기반 장소 상세 조회 정보를 가져옵니다.
 * @param type - 'restaurant' or 'tourist'
 * @param placeId - 장소 id
 */
export const get_search_detail = async (param: {
  type: string
  placeId: number
}): Promise<SearchDetail> => {
  return await instance('kkilogbu/')
    .get(`place/search/${param.type}/images/${param.placeId}`)
    .json()
}

/**
 * 검색어를 기반으로 맛집 또는 관광지를 검색합니다.
 * @param query - 검색어
 * @param offset - 데이터의 시작점
 * @param limit - 한 번에 가져올 데이터 크기
 * @returns
 */
export const get_place_search = async ({
  query,
  offset,
  limit,
}: {
  query: string
  offset: number
  limit: number
}) => {
  try {
    const params = {
      query,
      offset: offset.toString(),
      limit: limit.toString(),
    }

    const response = await service.getSearchPlace(params)
    return PlaceArraySchema.parse(response)
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('데이터 유효성 검사 실패:', error.errors)
    } else {
      console.error('알 수 없는 에러 발생:', error)
    }
    throw error
  }
}

/**
 * 검색어를 기반으로 기록을 가져옵니다.
 * @param query - 검색어
 * @param offset - 데이터의 시작점
 * @param limit - 한 번에 가져올 데이터 수
 * @returns
 */
export const get_feed_search = async ({
  query,
  offset,
  limit,
}: {
  query: string
  offset: number
  limit: number
}) => {
  try {
    const params = {
      query,
      offset: offset.toString(),
      limit: limit.toString(),
    }

    const response = await instance('kkilogbu/')
      .get('record/images', {
        searchParams: params,
      })
      .json()
    return FeedArraySchema.parse(response)
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('데이터 유효성 검사 실패:', error.errors)
    } else {
      console.error('알 수 없는 에러 발생:', error)
    }
    throw error
  }
}
