import { type NavigationProp } from '@react-navigation/core'
import { Alert } from 'react-native'

import { checkPermission } from '@/services/auth'

interface NavigateWithPermissionCheckProps {
  navigation: NavigationProp<any>
  routeName: string
  params?: object
}

export const navigateWithPermissionCheck = ({
  navigation,
  routeName,
  params,
}: NavigateWithPermissionCheckProps) => {
  const hasPermission = checkPermission(routeName)

  if (!hasPermission) {
    Alert.alert(`로그인 사용자만 이용 가능합니다.`)
  } else {
    navigation.navigate(routeName, params)
  }
}
