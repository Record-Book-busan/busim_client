import { useState, useEffect } from 'react'

import { storage } from '@/utils/storage'

const MAX_RECENT_SEARCHES = 5

export type RecordRecentSearch = {
  id: number
  query: string
}

export const useRecentSearch = () => {
  const [recentSearches, setRecentSearches] = useState<RecordRecentSearch[]>([])

  useEffect(() => {
    loadRecentSearches()
  }, [])

  const loadRecentSearches = () => {
    const searches = storage.getString('record_recent_searches')
    if (searches) {
      try {
        const parsedSearches = JSON.parse(searches)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setRecentSearches(parsedSearches)
      } catch (error) {
        console.error('Failed to load recent searches:', error)
        storage.set('record_recent_searches', JSON.stringify([]))
      }
    }
  }

  const updateRecentSearches = (updatedSearches: RecordRecentSearch[]) => {
    storage.set('record_recent_searches', JSON.stringify(updatedSearches))
    setRecentSearches(updatedSearches)
  }

  const addRecentSearch = (query: string) => {
    if (!query.trim()) return
    const newItem: RecordRecentSearch = { id: parseInt(Date.now().toString()), query }
    const updatedSearches = [newItem, ...recentSearches.filter(s => s.query !== query)].slice(
      0,
      MAX_RECENT_SEARCHES,
    )
    updateRecentSearches(updatedSearches)
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
