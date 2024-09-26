import { type NavigationProp } from '@react-navigation/core'

import { checkPermission } from '@/services/auth'

import { usePopup } from './usePopup'

interface navigateWithPermissionCheckProps<T extends object = any> {
  navigation: NavigationProp<T>
  routeName: string
  params?: object
}

export const useNavigateWithPermissionCheck = () => {
  const { openPopup } = usePopup()

  const navigateWithPermissionCheck = ({
    navigation,
    routeName,
    params,
  }: navigateWithPermissionCheckProps) => {
    const hasPermission = checkPermission(routeName)

    if (!hasPermission) {
      console.log('permisson denied')
      openPopup()
    } else {
      navigation.navigate(routeName, params)
    }
  }

  return {
    navigateWithPermissionCheck,
  }
}
