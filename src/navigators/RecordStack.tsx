import { createStackNavigator } from '@react-navigation/stack'

import {
  RecordDetailScreen,
  RecordMainScreen,
  RecordResultScreen,
  RecordSearchScreen,
} from '@/screens'

import type { RecordStackParamList } from '@/types/navigation'

const Stack = createStackNavigator<RecordStackParamList>()

function RecordStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="RecordMain" component={RecordMainScreen} />
      <Stack.Screen name="RecordSearch" component={RecordSearchScreen} />
      <Stack.Screen name="RecordResult" component={RecordResultScreen} />
      <Stack.Screen name="ReadRecord" component={RecordDetailScreen} />
    </Stack.Navigator>
  )
}
export default RecordStackNavigator
