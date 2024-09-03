import { NavigationProp, RouteProp, useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { Text } from 'react-native'

import { SafeScreen, SearchBar } from '@/components/common'
import { PlaceItem, SubTab } from '@/components/search'

import type { RootStackParamList, SearchStackParamList } from '@/types/navigation'

function SearchScreen({ route }: { route: RouteProp<SearchStackParamList, 'Search'> }) {
  useEffect(() => {
    console.log(route.params)
  }, [])

  const navigation = useNavigation<NavigationProp<RootStackParamList, 'SearchStack'>>()

  const [isSearch, setSearch] = useState(false)

  const searchClickHandler = () => {
    setSearch(true)
  }

  useEffect(() => {
    if (isSearch) {
      navigation.setOptions({ headerTitle: '검색 결과' })
    }
  }, [isSearch])

  const moveDetailHandler = (id: string) => {
    navigation.navigate('SearchStack', { screen: 'Detail', params: { id: id } })
  }

  const deleteHistoryHandler = (id: string) => {
    setHistory(prevHistory => prevHistory.filter(item => item.id !== id))
  }

  const [history, setHistory] = useState([
    {
      id: '1',
      title: '장소명',
      position: '위치 정보 제공 칸입니다',
      onPressMove: moveDetailHandler,
      onPressDel: deleteHistoryHandler,
    },
    {
      id: '2',
      title: '장소명',
      position: '위치 정보 제공 칸입니다',
      onPressMove: moveDetailHandler,
      onPressDel: deleteHistoryHandler,
    },
    {
      id: '3',
      title: '장소명',
      position: '위치 정보 제공 칸입니다',
      onPressMove: moveDetailHandler,
      onPressDel: deleteHistoryHandler,
    },
  ])

  return (
    <SafeScreen excludeEdges={['top']}>
      <SearchBar type="default" placeholder="장소 검색" onPress={searchClickHandler} />
      {!isSearch && <Text className="px-2 py-4 font-bold">최근 검색 기록</Text>}
      {!isSearch ? (
        history.map(item => <PlaceItem key={item.id} {...item} />)
      ) : (
        <SubTab moveDetailHandler={moveDetailHandler} />
      )}
    </SafeScreen>
  )
}

export default SearchScreen
