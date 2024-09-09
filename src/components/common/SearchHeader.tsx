import { View } from 'react-native'

import { Header } from '@/shared'
import { cn } from '@/utils/cn'

import { SearchBar, type SearchBarProps } from './SearchBar'

interface SearchHeaderProps extends SearchBarProps {
  containerStyle?: string
}

export function SearchHeader({ containerStyle, ...props }: SearchHeaderProps) {
  return (
    <>
      <Header containerStyle="pt-0" center={false}>
        <View className={cn('flex-1', containerStyle)}>
          <SearchBar containerStyle="p-0" {...props} />
        </View>
      </Header>
    </>
  )
}
