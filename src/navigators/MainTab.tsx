import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import { Platform, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { MyPageScreen } from '@/screens'
import { SvgIcon } from '@/shared'

import MapStackNavigator from './MapStack'

import type { IconName } from '@/shared/SvgIcon'
import type { MainTabParamList, RootStackParamList } from '@/types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'

const TabBarIcon = ({ name, color, size }: { name: IconName; color: string; size: number }) => (
  <View className="flex-1 items-center justify-center">
    <SvgIcon name={name} size={size} className={`text-[${color}]`} />
  </View>
)

const Tab = createBottomTabNavigator<MainTabParamList>()

function MainTabNavigator() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

  return (
    <Tab.Navigator
      initialRouteName="Map"
      screenOptions={{
        tabBarStyle: {
          position: 'absolute',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderStartWidth: 0.5,
          borderStartColor: '#d1d5db80',
          height: Platform.OS === 'ios' ? 60 + insets.bottom : 60,
          paddingBottom: insets.bottom,
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
        component={MapStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: '추천',
          tabBarIcon: props => <TabBarIcon name="recommend" {...props} />,
        }}
      />
      <Tab.Screen
        name="Camera"
        component={EmptyComponent}
        options={{
          tabBarLabel: '카메라',
          tabBarIcon: props => <TabBarIcon name="camera" {...props} />,
          tabBarButton: props => (
            <TouchableOpacity
              {...props}
              onPress={() => navigation.navigate('Record', { screen: 'CameraCapture' })}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          headerTitle: '마이페이지',
          tabBarLabel: '마이페이지',
          tabBarIcon: props => <TabBarIcon name="my" {...props} />,
        }}
      />
    </Tab.Navigator>
  )
}

export default MainTabNavigator

const EmptyComponent = () => null
