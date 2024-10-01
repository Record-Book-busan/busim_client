import { useNavigation } from '@react-navigation/native'
import { Image, Pressable, View } from 'react-native'

import { user } from '@/assets/images'
import { useNavigateWithPermissionCheck } from '@/hooks/useNavigationPermissionCheck'
import { useGetUserInfo } from '@/services/user'
import { Button, SvgIcon, Typo } from '@/shared'
import { AuthStackParamList } from '@/types/navigation'

import type { StackNavigationProp } from '@react-navigation/stack'

export function UserInfoItem() {
  const { data } = useGetUserInfo()
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'MainTab'>>()
  const { navigateWithPermissionCheck } = useNavigateWithPermissionCheck()

  const handlePressButton = () =>
    navigateWithPermissionCheck({
      navigation,
      routeName: 'MyPageStack',
      params: {
        screen: 'MyPageSettings',
      },
    })

  const renderImg = data?.profileImage || user

  return (
    <Button type="text" buttonStyle="rounded-xl py-2" onPress={handlePressButton}>
      <View className="w-full flex-row items-center justify-between px-1">
        <View className="flex-row items-center">
          <Image
            className="mr-4 h-14 w-14 rounded-full bg-gray-300"
            source={typeof renderImg === 'string' ? { uri: renderImg } : renderImg}
            resizeMode="cover"
          />
          <View className="flex-col gap-0.5">
            <Typo className="font-SemiBold text-lg text-gray-900">{data.nickname}</Typo>
            <Typo className="text-[13px] text-gray-500">내 정보 수정하기</Typo>
          </View>
        </View>
        <Pressable onPress={handlePressButton}>
          <SvgIcon name="setting" className="text-gray-400" />
        </Pressable>
      </View>
    </Button>
  )
}
