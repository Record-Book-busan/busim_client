import { createStackNavigator } from '@react-navigation/stack'

import { RecordCreateScreen, RecordDetailScreen, RecordEditScreen } from '@/screens'

import type { RecordStackParamList } from '@/types/navigation'

const Stack = createStackNavigator<RecordStackParamList>()

function RecordStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CreateRecord" component={RecordCreateScreen} />
      <Stack.Screen name="EditRecord" component={RecordEditScreen} />
      <Stack.Screen name="ReadRecord" component={RecordDetailScreen} />
    </Stack.Navigator>
  )
}
export default RecordStackNavigator
