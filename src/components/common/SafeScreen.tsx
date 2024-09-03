import { useColorScheme } from 'nativewind'
import { StatusBar } from 'react-native'
import { SafeAreaView, type Edge } from 'react-native-safe-area-context'

type SafeScreenProps = {
  children: React.ReactNode
  excludeEdges?: Edge[]
}

export function SafeScreen({ children, excludeEdges = [] }: SafeScreenProps) {
  const { colorScheme } = useColorScheme()

  return (
    <SafeAreaView
      edges={['top', 'right', 'bottom', 'left'].filter(
        (edge): edge is Edge => !excludeEdges.includes(edge as Edge),
      )}
      style={{ flex: 1 }}
    >
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      {children}
    </SafeAreaView>
  )
}
