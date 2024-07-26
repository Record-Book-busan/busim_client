import { useColorScheme } from 'nativewind'
import React from 'react'
import { StatusBar, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type SafeScreenProps = {
  children: React.ReactNode
  excludeEdges?: ('top' | 'bottom' | 'left' | 'right')[]
}

function SafeScreen({ children, excludeEdges = [] }: SafeScreenProps) {
  const insets = useSafeAreaInsets()
  const { colorScheme } = useColorScheme()

  return (
    <View
      className="flex-1 bg-white dark:bg-gray-900"
      style={{
        paddingTop: excludeEdges.includes('top') ? 0 : insets.top,
        paddingBottom: excludeEdges.includes('bottom') ? 0 : insets.bottom,
        paddingLeft: excludeEdges.includes('left') ? 0 : insets.left,
        paddingRight: excludeEdges.includes('right') ? 0 : insets.right,
      }}
    >
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      {children}
    </View>
  )
}

export default SafeScreen
