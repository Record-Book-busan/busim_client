import { type NavigationProp, useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

import { InterestTourScreen, InterestFoodScreen } from '@/screens'

import type { InterestStackParamList, RootStackParamList } from '@/types/navigation'

const Stack = createStackNavigator<InterestStackParamList>()

const Skip = React.memo(() => {
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'MainTab'>>()

  const moveMapHandler = () => {
    navigation.navigate('MainTab', { screen: 'Map' })
  }

  return (
    <TouchableOpacity onPress={moveMapHandler}>
      <Text className="mr-4 underline">전체 건너뛰기</Text>
    </TouchableOpacity>
  )
})

function InterestStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="InterestTour"
        component={InterestTourScreen}
        options={{
          title: '',
          headerRight: () => <Skip />,
        }}
      />
      <Stack.Screen
        name="InterestFood"
        component={InterestFoodScreen}
        options={{
          title: '',
          headerRight: () => <Skip />,
        }}
      />
    </Stack.Navigator>
  )
}

export default InterestStackNavigator
