import {
  type BottomTabBarButtonProps,
  type BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import { Platform, TouchableOpacity, View, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { navigateWithPermissionCheck } from '@/hooks/useNavigationPermissionCheck'
import { MapScreen, MyPageScreen } from '@/screens'
import { SvgIcon } from '@/shared'

import RecordStackNavigator from './RecordStack'

import type { IconName } from '@/shared/SvgIcon'
import type { MainTabParamList, RootStackParamList } from '@/types/navigation'

const TabBarIcon = ({ name, size, color }: { name: IconName; size: number; color: string }) => {
  return (
    <View className="flex-1 items-center justify-center">
      <SvgIcon name={name} size={size} style={{ color: color } as ViewStyle} />
    </View>
  )
}

const Tab = createBottomTabNavigator<MainTabParamList>()

function MainTabNavigator() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<BottomTabNavigationProp<RootStackParamList, 'MainTab'>>()

  return (
    <Tab.Navigator
      initialRouteName="Map"
      detachInactiveScreens={false}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderStartWidth: 0.5,
          borderStartColor: '#d1d5db80',
          height: Platform.OS === 'ios' ? 60 + insets.bottom : 72,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : insets.bottom + 12,
          backgroundColor: 'white',
          shadowColor: '#64748b',
          shadowOpacity: 0.1,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: -2 },
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4,
          marginBottom: Platform.OS === 'ios' ? 4 : 8,
        },
        tabBarIconStyle: {
          marginTop: 8,
        },
        tabBarActiveTintColor: '#0E4194',
        tabBarInactiveTintColor: '#9ca3af',
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: '추천',
          tabBarIcon: props => <TabBarIcon name="recommend" {...props} />,
          tabBarButton: (props: BottomTabBarButtonProps) => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                navigateWithPermissionCheck({
                  navigation,
                  routeName: 'Map',
                })
              }}
            >
              <View>{props.children}</View>
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="Record"
        component={RecordStackNavigator}
        options={{
          tabBarLabel: '기록',
          tabBarIcon: props => <TabBarIcon name="cameraRoll" {...props} />,
          tabBarButton: (props: BottomTabBarButtonProps) => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                navigateWithPermissionCheck({
                  navigation,
                  routeName: 'Record',
                })
              }}
            >
              <View>{props.children}</View>
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          tabBarLabel: '마이페이지',
          tabBarIcon: props => <TabBarIcon name="my" {...props} />,
          tabBarButton: (props: BottomTabBarButtonProps) => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                navigateWithPermissionCheck({
                  navigation,
                  routeName: 'MyPage',
                })
              }}
            >
              <View>{props.children}</View>
            </TouchableOpacity>
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default MainTabNavigator
