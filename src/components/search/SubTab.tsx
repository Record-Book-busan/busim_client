import { useState } from 'react'
import { View } from 'react-native'

import { Tab, TabView } from '@/shared'

import { ImagePlaceItem } from '.'

type SubTabProps = {
  moveDetailHandler: (id: string) => void
}

export function SubTab({ moveDetailHandler }: SubTabProps) {
  const [index, setIndex] = useState(0)

  const bookMarkHandler = (id: string) => {
    console.log(id)
  }

  const [place] = useState([
    {
      id: '1',
      title: '장소 제목',
      category: '관광지/자연',
      description: '추가 설명글',
      onPressBookMark: bookMarkHandler,
      onPressMove: moveDetailHandler,
      isBookMarked: false,
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfVhju-h_98uFgOD8WzzMMHJ9PEkPSIhdRVA&s',
    },
    {
      id: '2',
      title: '장소 제목',
      category: '관광지/자연',
      description: '추가 설명글',
      onPressBookMark: bookMarkHandler,
      onPressMove: moveDetailHandler,
      isBookMarked: false,
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfVhju-h_98uFgOD8WzzMMHJ9PEkPSIhdRVA&s',
    },
    {
      id: '3',
      title: '장소 제목',
      category: '관광지/자연',
      description: '추가 설명글',
      onPressBookMark: bookMarkHandler,
      onPressMove: moveDetailHandler,
      isBookMarked: false,
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfVhju-h_98uFgOD8WzzMMHJ9PEkPSIhdRVA&s',
    },
  ])

  const [history] = useState([
    {
      id: '1',
      title: '여행 기록 제목',
      category: '관광지/자연',
      description: '추가 설명글',
      onPressBookMark: bookMarkHandler,
      onPressMove: moveDetailHandler,
      isBookMarked: false,
      imageUrl:
        'https://gscaltexmediahub.com/wp-content/uploads/2023/05/the-day-of-ocean-2023_1.png',
    },
    {
      id: '2',
      title: '여행 기록 제목',
      category: '관광지/자연',
      description: '추가 설명글',
      onPressBookMark: bookMarkHandler,
      onPressMove: moveDetailHandler,
      isBookMarked: false,
      imageUrl:
        'https://gscaltexmediahub.com/wp-content/uploads/2023/05/the-day-of-ocean-2023_1.png',
    },
    {
      id: '3',
      title: '여행 기록 제목',
      category: '관광지/자연',
      description: '추가 설명글',
      onPressBookMark: bookMarkHandler,
      onPressMove: moveDetailHandler,
      isBookMarked: false,
      imageUrl:
        'https://gscaltexmediahub.com/wp-content/uploads/2023/05/the-day-of-ocean-2023_1.png',
    },
  ])

  return (
    <View className="flex-1 bg-white">
      <View className="bg-white shadow">
        <Tab value={index} onValueChange={setIndex}>
          <Tab.Item>장소</Tab.Item>
          <Tab.Item>여행 기록</Tab.Item>
        </Tab>
      </View>
      <TabView value={index} onValueChange={setIndex}>
        <TabView.Item>
          <View>
            {place.map(item => (
              <ImagePlaceItem key={item.id} {...item} />
            ))}
          </View>
        </TabView.Item>
        <TabView.Item>
          <View>
            {history.map(item => (
              <ImagePlaceItem key={item.id} {...item} />
            ))}
          </View>
        </TabView.Item>
      </TabView>
    </View>
  )
}
