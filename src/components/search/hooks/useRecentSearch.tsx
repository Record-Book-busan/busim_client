import { useState, useEffect } from 'react'

import { PlaceArraySchema, PlaceSchema, type Place } from '@/types/schemas/search'
import { storage } from '@/utils/storage'

export const useRecentSearch = () => {
  const [recentSearches, setRecentSearches] = useState<Place[]>([])

  useEffect(() => {
    loadRecentSearches()
  }, [])

  const loadRecentSearches = () => {
    const searches = storage.getString('recentSearches')
    if (searches) {
      try {
        const parsedSearches = JSON.parse(searches)
        const validatedSearches = PlaceArraySchema.parse(parsedSearches)
        setRecentSearches(validatedSearches)
      } catch (error) {
        console.error('Failed to load recent searches:', error)
        storage.set('recentSearches', JSON.stringify([]))
      }
    }
  }

  const updateRecentSearches = (updatedSearches: Place[]) => {
    const validatedSearches = PlaceArraySchema.parse(updatedSearches)
    storage.set('recentSearches', JSON.stringify(validatedSearches))
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
