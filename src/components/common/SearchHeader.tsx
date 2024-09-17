import { View } from 'react-native'

import { Header } from '@/shared'
import { cn } from '@/utils/cn'

import { SearchBar, type SearchBarProps } from './SearchBar'

interface SearchHeaderProps extends SearchBarProps {
  /**
   * 컨테이너의 커스텀 스타일
   */
  containerStyle?: string

  /**
   * 뒤로 가기 버튼을 눌렀을 때 호출되는 콜백
   */
  onBackPress?: () => void
}

/**
 * 헤더 내에 SearchBar를 포함하는 컴포넌트
 */
export function SearchHeader({ containerStyle, onBackPress, ...props }: SearchHeaderProps) {
  return (
    <Header containerStyle="pt-0" center={false} onBackPress={onBackPress}>
      <View className={cn('flex-1', containerStyle)}>
        <SearchBar {...props} containerStyle="p-0" />
      </View>
    </Header>
  )
}
