import { useFocusEffect } from '@react-navigation/native'
import React, { useEffect } from 'react'
import {
  ColorValue,
  Platform,
  StatusBar,
  StatusBarStyle,
  type ViewStyle,
  type StyleProp,
} from 'react-native'
import { SafeAreaView, type Edge } from 'react-native-safe-area-context'

type SafeScreenProps = {
  children: React.ReactNode
  excludeEdges?: Edge[]
  bgColor?: ColorValue
  textColor?: StatusBarStyle
  statusBarColor?: ColorValue
  isTranslucent?: boolean
  style?: StyleProp<ViewStyle>
}

export function SafeScreen({
  children,
  excludeEdges = [],
  bgColor = 'white',
  textColor = 'dark-content',
  statusBarColor = 'white',
  isTranslucent = false,
  style,
}: SafeScreenProps) {
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBarStyle(textColor)
        StatusBar.setBackgroundColor(statusBarColor)
        StatusBar.setTranslucent(isTranslucent)
      }
    }, [textColor, statusBarColor, isTranslucent]),
  )

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBarStyle(textColor)
      StatusBar.setBackgroundColor(statusBarColor)
      StatusBar.setTranslucent(isTranslucent)
    }
  }, [textColor, statusBarColor, isTranslucent])

  return (
    <SafeAreaView
      edges={['top', 'right', 'bottom', 'left'].filter(
        (edge): edge is Edge => !excludeEdges.includes(edge as Edge),
      )}
      style={[{ flex: 1, backgroundColor: bgColor }, style]}
    >
      {Platform.OS === 'ios' && <StatusBar barStyle={textColor} backgroundColor={statusBarColor} />}
      {children}
    </SafeAreaView>
  )
}
