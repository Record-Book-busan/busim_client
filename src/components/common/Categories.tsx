import { useMemo, useState } from 'react'
import { View } from 'react-native'

import { Chip } from '@/shared'

import { CATEGORY } from './constant'

export const MAP_TYPE = {
  TOUR_LIST: 'tourist',
  FOOD: 'food',
} as const

export type MapType = (typeof MAP_TYPE)[keyof typeof MAP_TYPE]

const MAP_TYPES = [
  { id: 'tourist', title: '관광지도' },
  { id: 'food', title: '맛집지도' },
] as const

const CATEGORIES = {
  [MAP_TYPE.TOUR_LIST]: [
    { id: CATEGORY.관광지, title: '관광지' },
    { id: CATEGORY.자연, title: '자연' },
    { id: CATEGORY.테마, title: '테마' },
    { id: CATEGORY.레포츠, title: '레포츠' },
    { id: CATEGORY.핫플, title: '핫플' },
  ],
  [MAP_TYPE.FOOD]: [
    { id: CATEGORY.맛집, title: '맛집' },
    { id: CATEGORY.카페, title: '카페' },
    { id: CATEGORY.술집, title: '술집' },
  ],
} as const

interface CategoriesProps {
  onCategoryChange: (categories: number[]) => void
}

export function Categories({ onCategoryChange }: CategoriesProps) {
  const [activeMapType, setActiveMapType] = useState<MapType | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])

  const handleMapTypeChange = (type: MapType) => {
    setActiveMapType(prevType => (prevType === type ? null : type))
    setSelectedCategories([])
  }

  const handleCategoryChange = (id: number) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(id)
        ? prev.filter(categoryId => categoryId !== id)
        : [...prev, id]
      onCategoryChange(newCategories)
      return newCategories
    })
  }

  const CategoryList = useMemo(() => {
    return activeMapType ? CATEGORIES[activeMapType] : []
  }, [activeMapType])

  return (
    <View>
      <View className="mb-2 flex-row justify-center">
        {MAP_TYPES.map(type => (
          <Chip
            key={type.id}
            title={type.title}
            isSelected={activeMapType === type.id}
            onPress={() => handleMapTypeChange(type.id as MapType)}
          />
        ))}
      </View>
      <View className="mb-4 flex-row flex-wrap justify-center">
        {CategoryList.map(category => (
          <Chip
            key={category.id}
            title={category.title}
            isSelected={selectedCategories.includes(category.id)}
            onPress={() => handleCategoryChange(category.id)}
          />
        ))}
      </View>
    </View>
  )
}
