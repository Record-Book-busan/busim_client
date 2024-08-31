import { createStackNavigator } from '@react-navigation/stack'
// import { Text, TouchableOpacity } from 'react-native'

import { CameraScreen, RecordScreen } from '@/screens'

import type { RecordStackParamList } from '@/types/navigation'

// type RecordNavigationProp = StackNavigationProp<RecordStackParamList>

const Stack = createStackNavigator<RecordStackParamList>()

function RecordStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CameraCapture"
        component={CameraScreen}
        // options={({ navigation }: { navigation: RecordNavigationProp }) => ({
        //   // TODO: custom header 만들기
        //   headerLeft: () => (
        //     <TouchableOpacity onPress={() => navigation.goBack()}>
        //       <Text>❌</Text>
        //     </TouchableOpacity>
        //   ),
        //   headerTitle: '',
        // })}
      />
      <Stack.Screen
        name="CreateRecord"
        component={RecordScreen}
        options={{
          headerTitle: '여행 기록 작성',
        }}
      />
    </Stack.Navigator>
  )
}
export default RecordStackNavigator
