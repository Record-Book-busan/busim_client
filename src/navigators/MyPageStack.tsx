import { createStackNavigator } from '@react-navigation/stack'

import { ProfileEditScreen } from '@/screens'
import { ImageCarouselTest } from '@/screens/MyPage/CarouselTest'
import Test from '@/screens/MyPage/Test'

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
          headerTitleAlign: 'center',
        }}
      />
      {/* <Stack.Screen name="MyPageSettings" component={SettingsScreen} /> */}
      <Stack.Screen name="Test" component={Test} options={{ headerShown: false }} />
      <Stack.Screen name="Test1" component={ImageCarouselTest} />
    </Stack.Navigator>
  )
}

export default MyPageStackNavigator
