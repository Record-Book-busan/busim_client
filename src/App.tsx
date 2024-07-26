import 'react-native-gesture-handler'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MMKV } from 'react-native-mmkv'

import ApplicationNavigator from './navigators/Application'
import './translations'

export const queryClient = new QueryClient()

export const storage = new MMKV()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ApplicationNavigator />
    </QueryClientProvider>
  )
}

export default App
