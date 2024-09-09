import { useColorScheme } from 'nativewind'
import { ColorValue, StatusBar, StatusBarStyle } from 'react-native'
import { SafeAreaView, type Edge } from 'react-native-safe-area-context'

type SafeScreenProps = {
  children: React.ReactNode
  excludeEdges?: Edge[]
  bgColor?: ColorValue
  textColor?: StatusBarStyle
}

export function SafeScreen({ children, excludeEdges = [], bgColor, textColor }: SafeScreenProps) {
  const { colorScheme } = useColorScheme()

  return (
    <SafeAreaView
      edges={['top', 'right', 'bottom', 'left'].filter(
        (edge): edge is Edge => !excludeEdges.includes(edge as Edge),
      )}
      style={{ flex: 1, backgroundColor: bgColor || 'white' }}
    >
      <StatusBar
        barStyle={textColor ? textColor : colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      {children}
    </SafeAreaView>
  )
}
