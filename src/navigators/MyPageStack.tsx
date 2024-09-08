import { createStackNavigator } from '@react-navigation/stack'

import { SafeScreen } from '@/components/common'
import { BookmarkListScreen, ProfileEditScreen, RecordListScreen } from '@/screens'
import Test from '@/screens/MyPage/Test'
import { Header } from '@/shared'

import type { MyPageStackParamList } from '@/types/navigation'

const Stack = createStackNavigator<MyPageStackParamList>()

function MyPageStackNavigator() {
  return (
    <SafeScreen>
      <Stack.Navigator>
        <Stack.Screen
          name="MyPageProfile"
          component={ProfileEditScreen}
          options={{
            header: () => <Header title="프로필 설정" />,
          }}
        />
        <Stack.Screen
          name="BookMarkList"
          component={BookmarkListScreen}
          options={{
            header: () => <Header title="북마크" />,
          }}
        />
        <Stack.Screen
          name="RecordList"
          component={RecordListScreen}
          options={{
            header: () => <Header title="나의 여행 기록" />,
          }}
        />
        <Stack.Screen
          name="Test"
          component={Test}
          options={{
            header: () => <Header title="테스트" />,
          }}
        />
      </Stack.Navigator>
    </SafeScreen>
  )
}

export default MyPageStackNavigator
