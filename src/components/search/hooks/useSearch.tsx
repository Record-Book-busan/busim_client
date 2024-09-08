import { useState } from 'react'

import { PlaceArraySchema, type Place } from '@/types/schemas/search'

const dummyData: Place[] = [
  {
    id: 1,
    name: '서울 맛집',
    address: '서울시 강남구',
    location: '서울 타워',
    latitude: 37.5665,
    longitude: 126.978,
    imageUrl: 'https://example.com/image1.jpg',
    category: '맛집',
  },
  {
    id: 2,
    name: '부산 해변',
    address: '부산시 해운대구',
    location: '해운대 해수욕장',
    latitude: 35.1586,
    longitude: 129.1604,
    imageUrl: 'https://example.com/image2.jpg',
    category: '관광지',
  },
  {
    id: 3,
    name: '제주 올레길',
    address: '제주특별자치도 서귀포시',
    location: '제주 올레 7코스',
    latitude: 33.2496,
    longitude: 126.5219,
    imageUrl: 'https://example.com/image3.jpg',
    category: '관광지',
  },
]

export const useSearch = () => {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Place[]>([])

  const searchPlaces = (searchQuery: string) => {
    setQuery(searchQuery)
    if (searchQuery.trim() === '') {
      setSearchResults([])
      return
    }
    const results = dummyData.filter(
      place =>
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.category.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    try {
      const validatedResults = PlaceArraySchema.parse(results)
      setSearchResults(validatedResults)
    } catch (error) {
      console.error('Invalid search results:', error)
      setSearchResults([])
    }
  }

  return {
    query,
    searchResults,
    searchPlaces,
  }
}
