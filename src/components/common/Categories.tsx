import { useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'

import { ROLE } from '@/services/auth'
import { useGetInterest } from '@/services/service'
import { Chip } from '@/shared'
import { storage } from '@/utils/storage'

import { CATEGORY, CategoryType } from '../../constants/data'

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
    { id: CATEGORY.특별한_맛집, title: '특별한 맛집' },
  ],
} as const

interface CategoriesProps {
  initCategories?: CategoryType[]
  onCategoryChange: (categories: CategoryType[]) => void
  isBookmark?: boolean
}

export function Categories({ initCategories = [], onCategoryChange, isBookmark }: CategoriesProps) {
  const getInterest = useGetInterest()

  useEffect(() => {
    if (storage.getString('role') === ROLE.MEMBER && initCategories.length === 0) {
      getInterest().then(response => {
        const categories = [...response.restaurantCategories, ...response.touristCategories]
        setSelectedCategories(categories as CategoryType[])
      })
    }
  }, [])

  const initialMapType =
    initCategories.length > 0
      ? initCategories.some(
          category => category === CATEGORY.맛집 || category === CATEGORY.특별한_맛집,
        )
        ? MAP_TYPE.FOOD
        : MAP_TYPE.TOUR_LIST
      : null

  const [activeMapType, setActiveMapType] = useState<MapType | null>(initialMapType)
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>(initCategories)

  const handleMapTypeChange = (type: MapType) => {
    if (isBookmark && activeMapType === type) return

    setActiveMapType(prevType => (prevType === type ? null : type))
    setSelectedCategories([])
    onCategoryChange([])
  }

  const handleCategoryChange = (cat: CategoryType) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(cat)
        ? prev.filter(category => category !== cat)
        : [...prev, cat]
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
