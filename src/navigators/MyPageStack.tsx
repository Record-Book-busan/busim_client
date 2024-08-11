import { createStackNavigator } from '@react-navigation/stack'

import { ProfileEditScreen } from '@/screens'

import type { MyPageStackParamList } from '@/types/navigation'

const Stack = createStackNavigator<MyPageStackParamList>()

function MyPageStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyPageProfile"
        component={ProfileEditScreen}
        options={{
          headerTitle: '프로필 설정',
        }}
      />
      {/* <Stack.Screen name="MyPageSettings" component={SettingsScreen} /> */}
    </Stack.Navigator>
  )
}

export default MyPageStackNavigator
