import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'

import { cn } from '@/utils/cn'

import { SvgIcon } from './SvgIcon'

interface HeaderProps {
  title?: string
  onBackPress?: () => void
  rightContent?: React.ReactNode
  containerStyle?: string
  titleStyle?: string
  children?: React.ReactNode
  center?: boolean
}

export function Header({
  title,
  onBackPress,
  rightContent,
  containerStyle,
  titleStyle,
  children,
  center = true,
}: HeaderProps) {
  const navigation = useNavigation()

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress()
    } else {
      navigation.goBack()
    }
  }

  return (
    <View
      className={cn(
        'flex-row items-center border-b border-b-gray-100 bg-white px-4 pb-2.5 pt-2',
        containerStyle,
      )}
    >
      <TouchableOpacity onPress={handleBackPress} className="w-10">
        <SvgIcon name="chevronLeft" width={18} height={18} className="text-gray-800" />
      </TouchableOpacity>

      {center ? (
        <>
          <View className="flex-1 items-center">
            {title && (
              <Text
                className={cn('text-lg font-semibold text-gray-800', titleStyle)}
                numberOfLines={1}
              >
                {title}
              </Text>
            )}
            {children}
          </View>
          <View className="w-10 items-end">{rightContent}</View>
        </>
      ) : (
        <>
          {title && (
            <Text
              className={cn('text-lg font-semibold text-gray-800', titleStyle)}
              numberOfLines={1}
            >
              {title}
            </Text>
          )}
          {children}
        </>
      )}
    </View>
  )
}
