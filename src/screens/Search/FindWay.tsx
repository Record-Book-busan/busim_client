import { Suspense, useState } from 'react'
import { Alert, Linking, TouchableOpacity, View } from 'react-native'

import { SafeScreen, SearchBar, SearchHeader } from '@/components/common'
import { SearchResults, RecentSearches } from '@/components/search'
import { useRecentSearch } from '@/services/search'
import { Typo } from '@/shared'

import type { Place } from '@/types/schemas/place'

type LocationType = {
  lat: number
  lon: number
}

export default function SearchScreen() {
  const [query, setQuery] = useState('')
  const [query2, setQuery2] = useState('')
  const [location2, setLocation2] = useState<LocationType | null>(null)
  const [query3, setQuery3] = useState('')
  const [location3, setLocation3] = useState<LocationType | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const { recentSearches, addRecentSearch, removeRecentSearch } = useRecentSearch()
  const [selectedQuery, setSelectedQuery] = useState<number>()

  const handleSearch = () => {
    setSelectedQuery(1)
    if (query.trim()) {
      setIsSearching(true)
    }
  }

  const handleInputChange = (text: string) => {
    setQuery(text)
    setIsSearching(false)
  }

  const handleInputChange2 = (text: string) => {
    setQuery2(text)
    setLocation2(null)
  }

  const handleInputChange3 = (text: string) => {
    setQuery3(text)
    setLocation3(null)
  }

  const navigateFillInput = (place: Place) => {
    addRecentSearch(place)

    console.log(`lat: ${place.latitude}, lon: ${place.longitude}`)

    if (selectedQuery === 2) {
      setQuery2(place.name)
      setLocation2({ lat: place.latitude, lon: place.longitude })
    } else if (selectedQuery === 3) {
      setQuery3(place.name)
      setLocation3({ lat: place.latitude, lon: place.longitude })
    } else {
      if (!query2.trim()) {
        setQuery2(place.name)
        setLocation2({ lat: place.latitude, lon: place.longitude })
      } else if (!query3.trim()) {
        setQuery3(place.name)
        setLocation3({ lat: place.latitude, lon: place.longitude })
      }
    }
  }

  const navigateKakaoMap = () => {
    if (!location2?.lat || !location2?.lon) {
      Alert.alert('출발지를 입력해주세요!')
      return
    } else if (!location3?.lat || !location3?.lon) {
      Alert.alert('도착지를 입력해주세요!')
      return
    }

    const navigateToKakao = async () => {
      try {
        const appUrl = `kakaomap://route?sp=${location2?.lat},${location2?.lon}&ep=${location3?.lat},${location3?.lon}&by=PUBLICTRANSIT`

        await Linking.openURL(appUrl)
      } catch {
        console.error('카카오맵 이동에 실패했습니다.')

        Alert.alert('카카오 지도 앱이 설치되어 있지 않습니다. 웹으로 이동하시겠습니까?', '', [
          { text: '취소', style: 'cancel' },
          {
            text: '웹으로 이동',
            onPress: () => Linking.openURL('https://map.kakao.com/link/to'),
          },
        ])
      }
    }

    navigateToKakao()
  }

  return (
    <SafeScreen>
      <SearchHeader
        type="input"
        placeholder="장소 검색"
        onChangeText={handleInputChange}
        value={query}
        onPress={handleSearch}
        onSubmitEditing={handleSearch}
      />
      <View className="flex h-[210px] justify-between border-t-2 border-[#dadada] px-4 py-4">
        <SearchBar
          type="button"
          placeholder="출발지를 선택해주세요."
          onChangeText={handleInputChange2}
          value={query2}
        />
        <SearchBar
          type="button"
          placeholder="도착지를 선택해주세요."
          onChangeText={handleInputChange3}
          value={query3}
        />
        <TouchableOpacity
          className="mt-3 flex h-12 justify-center rounded-2xl bg-[#00339d]"
          onPress={navigateKakaoMap}
        >
          <Typo className="w-full text-center text-base font-bold text-white">검색하기</Typo>
        </TouchableOpacity>
      </View>
      <View className="flex-1">
        {!isSearching ? (
          <RecentSearches
            recentSearches={recentSearches}
            onItemPress={navigateFillInput}
            onItemDelete={removeRecentSearch}
          />
        ) : (
          <Suspense fallback={<Typo>Loading...</Typo>}>
            {query.trim() !== '' && (
              <SearchResults query={query} onItemPress={navigateFillInput} isNextButton={false} />
            )}
          </Suspense>
        )}
      </View>
    </SafeScreen>
  )
}
