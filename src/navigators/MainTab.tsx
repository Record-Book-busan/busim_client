import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Platform, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { MapScreen, PrepareScreen } from '@/screens'
import { SvgIcon } from '@/shared'

import RecordStackNavigator from './RecordStack'

import type { IconName } from '@/shared/SvgIcon'
import type { MainTabParamList } from '@/types/navigation'

const TabBarIcon = ({ name, size, color }: { name: IconName; size: number; color: string }) => {
  return (
    <View className="flex-1 items-center justify-center">
      <SvgIcon name={name} size={size} style={{ color: color }} />
    </View>
  )
}

const Tab = createBottomTabNavigator<MainTabParamList>()

function MainTabNavigator() {
  const insets = useSafeAreaInsets()

  return (
    <Tab.Navigator
      initialRouteName="Map"
      detachInactiveScreens={false}
      screenOptions={{
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
          headerShown: false,
          tabBarLabel: '추천',
          tabBarIcon: props => <TabBarIcon name="recommend" {...props} />,
        }}
      />
      <Tab.Screen
        name="Record"
        component={RecordStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: '기록',
          tabBarIcon: props => <TabBarIcon name="cameraRoll" {...props} />,
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={PrepareScreen}
        // component={MyPageScreen}
        options={{
          headerShown: false,
          headerTitle: '마이페이지',
          tabBarLabel: '마이페이지',
          tabBarIcon: props => <TabBarIcon name="my" {...props} />,
        }}
      />
    </Tab.Navigator>
  )
}

export default MainTabNavigator
