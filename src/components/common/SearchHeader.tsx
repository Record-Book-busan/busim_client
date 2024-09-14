import { View } from 'react-native'

import { Header } from '@/shared'
import { cn } from '@/utils/cn'

import { SearchBar, type SearchBarProps } from './SearchBar'

interface SearchHeaderProps extends SearchBarProps {
  mode?: 'view' | 'bar'
  containerStyle?: string
}

export function SearchHeader({ mode, containerStyle, ...props }: SearchHeaderProps) {
  return (
    <Header containerStyle="pt-0" center={false}>
      <View className={cn('flex-1', containerStyle)}>
        {mode === 'view' ? (
          <SearchBar containerStyle="p-0 " {...props} />
        ) : (
          <SearchBar containerStyle="p-0 " {...props} />
        )}
      </View>
    </Header>
  )
}
