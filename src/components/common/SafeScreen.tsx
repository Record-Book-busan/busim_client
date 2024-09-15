import { useColorScheme } from 'nativewind'
import { useEffect } from 'react'
import { ColorValue, Platform, StatusBar, StatusBarStyle } from 'react-native'
import { SafeAreaView, type Edge } from 'react-native-safe-area-context'

type SafeScreenProps = {
  children: React.ReactNode
  excludeEdges?: Edge[]
  bgColor?: ColorValue
  textColor?: StatusBarStyle
  statusBarColor?: ColorValue
  isTranslucent?: boolean
}

export function SafeScreen({
  children,
  excludeEdges = [],
  bgColor = 'white',
  textColor,
  statusBarColor = 'white',
  isTranslucent = false,
}: SafeScreenProps) {
  const { colorScheme } = useColorScheme()

  useEffect(() => {
    StatusBar.setBarStyle(
      textColor ? textColor : colorScheme === 'dark' ? 'light-content' : 'dark-content',
    )

    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(statusBarColor)
      StatusBar.setTranslucent(isTranslucent)
    }
  }, [textColor, statusBarColor, isTranslucent])

  return (
    <SafeAreaView
      edges={['top', 'right', 'bottom', 'left'].filter(
        (edge): edge is Edge => !excludeEdges.includes(edge as Edge),
      )}
      style={{ flex: 1, backgroundColor: bgColor }}
    >
      {/* <StatusBar
        barStyle={textColor ? textColor : colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={statusBarColor}
        translucent={isTranslucent}
      /> */}
      {children}
    </SafeAreaView>
  )
}
