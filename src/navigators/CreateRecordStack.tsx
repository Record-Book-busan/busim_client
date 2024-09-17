import { createStackNavigator } from '@react-navigation/stack'

import { RecordCreateScreen, RecordEditScreen } from '@/screens'

import type { CreateRecordStackParamList } from '@/types/navigation'

const Stack = createStackNavigator<CreateRecordStackParamList>()

function CreateRecordStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CreateRecord" component={RecordCreateScreen} />
      <Stack.Screen name="EditRecord" component={RecordEditScreen} />
    </Stack.Navigator>
  )
}
export default CreateRecordStackNavigator
