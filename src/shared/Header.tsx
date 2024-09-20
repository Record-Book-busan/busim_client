import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View, TouchableOpacity } from 'react-native'

import { cn } from '@/utils/cn'

import { SvgIcon } from './SvgIcon'
import { Typo } from './Typo'

interface HeaderProps {
  title?: string
  onBackPress?: () => void
  LeftContent?: React.ReactNode
  rightContent?: React.ReactNode
  containerStyle?: string
  titleStyle?: string
  children?: React.ReactNode
  center?: boolean
}

export function Header({
  title,
  onBackPress,
  LeftContent,
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
    <View className={cn('flex-row items-center bg-white px-4 pb-2.5 pt-2', containerStyle)}>
      {LeftContent ? (
        LeftContent
      ) : (
        <TouchableOpacity onPress={handleBackPress} className="w-8">
          <SvgIcon name="chevronLeft" width={18} height={18} className="text-gray-900" />
        </TouchableOpacity>
      )}

      {center ? (
        <>
          <View className="flex-1 items-center">
            {title && (
              <Typo
                className={cn('font-SemiBold text-lg text-gray-800', titleStyle)}
                numberOfLines={1}
              >
                {title}
              </Typo>
            )}
            {children}
          </View>
          <View className="w-10 items-end">{rightContent}</View>
        </>
      ) : (
        <>
          {title && (
            <Typo
              className={cn('font-SemiBold text-lg text-gray-800', titleStyle)}
              numberOfLines={1}
            >
              {title}
            </Typo>
          )}
          {children}
        </>
      )}
    </View>
  )
}
