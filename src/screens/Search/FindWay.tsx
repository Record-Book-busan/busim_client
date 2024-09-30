import { Suspense, useState } from 'react'
import { Alert, Linking, TouchableOpacity, View } from 'react-native'

import { SafeScreen, SearchBar } from '@/components/common'
import { SearchResults, RecentSearches } from '@/components/search'
import { useRecentSearch } from '@/services/search'
import { Typo } from '@/shared'

import type { Place } from '@/types/schemas/place'

type LocationType = {
  lat: number
  lon: number
}

export default function SearchScreen() {
  const [startQuery, setStartQuery] = useState('')
  const [startLocation, setStartLocation] = useState<LocationType | null>(null)
  const [endQuery, setEndQuery] = useState('')
  const [endLocation, setEndLocation] = useState<LocationType | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const { recentSearches, addRecentSearch, removeRecentSearch } = useRecentSearch()
  const [selectedQuery, setSelectedQuery] = useState<string>('start')

  const handleStartSearch = () => {
    setSelectedQuery('start')
    if (startQuery.trim()) {
      setIsSearching(true)
    }
  }

  const handleEndSearch = () => {
    setSelectedQuery('end')
    if (endQuery.trim()) {
      setIsSearching(true)
    }
  }

  const handleStartInputChange = (text: string) => {
    setStartQuery(text)
    setStartLocation(null)
  }

  const handleEndInputChange = (text: string) => {
    setEndQuery(text)
    setEndLocation(null)
  }

  const fillStartInput = (place: Place) => {
    addRecentSearch(place)

    console.log(`fillStartInput lat: ${place.latitude}, lon: ${place.longitude}`)

    setStartQuery(place.name)
    setStartLocation({ lat: place.latitude, lon: place.longitude })
  }

  const fillEndInput = (place: Place) => {
    addRecentSearch(place)

    console.log(`fillEndInput lat: ${place.latitude}, lon: ${place.longitude}`)

    setEndQuery(place.name)
    setEndLocation({ lat: place.latitude, lon: place.longitude })
  }

  const navigateKakaoMap = () => {
    if (!startLocation?.lat || !startLocation?.lon) {
      Alert.alert('출발지를 입력해주세요!')
      return
    } else if (!endLocation?.lat || !endLocation?.lon) {
      Alert.alert('도착지를 입력해주세요!')
      return
    }

    const navigateToKakao = async () => {
      try {
        const appUrl = `kakaomap://route?sp=${startLocation?.lat},${startLocation?.lon}&ep=${endLocation?.lat},${endLocation?.lon}&by=PUBLICTRANSIT`

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
    <SafeScreen excludeEdges={['top']}>
      <View className="flex h-[210px] justify-between border-t-2 border-[#dadada] px-4 py-4">
        <SearchBar
          type="input"
          placeholder="출발지를 선택해주세요."
          onChangeText={handleStartInputChange}
          value={startQuery}
          onPress={handleStartSearch}
          onSubmitEditing={handleStartSearch}
          setClicked={() => setSelectedQuery('start')}
        />
        <SearchBar
          type="input"
          placeholder="도착지를 선택해주세요."
          onChangeText={handleEndInputChange}
          value={endQuery}
          onPress={handleEndSearch}
          onSubmitEditing={handleEndSearch}
          setClicked={() => setSelectedQuery('end')}
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
            onItemPress={selectedQuery === 'start' ? fillStartInput : fillEndInput}
            onItemDelete={removeRecentSearch}
          />
        ) : (
          <Suspense fallback={<Typo>Loading...</Typo>}>
            {startQuery.trim() !== '' && selectedQuery === 'start' && (
              <SearchResults query={startQuery} onItemPress={fillStartInput} isNextButton={false} />
            )}
            {endQuery.trim() !== '' && selectedQuery === 'end' && (
              <SearchResults query={endQuery} onItemPress={fillEndInput} isNextButton={false} />
            )}
          </Suspense>
        )}
      </View>
    </SafeScreen>
  )
}
