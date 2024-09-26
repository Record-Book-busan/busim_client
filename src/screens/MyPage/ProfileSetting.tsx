import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { View, TouchableOpacity, Image, Text, Pressable } from 'react-native'

import { user } from '@/assets/images'
import { SafeScreen } from '@/components/common'
import { ProfilePickerSheet } from '@/components/user'
import { useGallery } from '@/hooks/useGallery'
import { useNavigateWithPermissionCheck } from '@/hooks/useNavigationPermissionCheck'
import { SvgIcon } from '@/shared'
import { MyPageStackParamList } from '@/types/navigation'

import type { StackNavigationProp } from '@react-navigation/stack'

export default function ProfileSettingScreen() {
  const navigation = useNavigation<StackNavigationProp<MyPageStackParamList, 'MyPageSettings'>>()
  const { navigateWithPermissionCheck } = useNavigateWithPermissionCheck()
  const { getPhoto } = useGallery()
  const [isOpenProfilePicker, setIsOpenProfilePicker] = useState(false)

  const handleGetPhoto = async () => {
    const image = await getPhoto()
    if (image && image.uri) {
      // updateUserInfoData('image', {
      //   uri: image.uri,
      //   type: image.type,
      //   fileName: image.fileName,
      // })
      setIsOpenProfilePicker(false)
    }
  }

  const handleResetPhoto = () => {
    // updateUserInfoData('image', null)
    setIsOpenProfilePicker(false)
  }

  const navigateToNicknameChange = () => {
    navigateWithPermissionCheck({
      navigation,
      routeName: 'MyPageNickName',
    })
  }

  return (
    <SafeScreen excludeEdges={['top']}>
      <View className="flex-1 bg-white">
        {/* 프로필 사진 */}
        <View className="mt-10 items-center">
          <TouchableOpacity className="relative" onPress={() => setIsOpenProfilePicker(true)}>
            <View className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-neutral-100 bg-blue-100">
              <Image source={user} style={{ width: '100%', height: '100%' }} />
            </View>
            <View className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-gray-300 p-1">
              <SvgIcon name="cameraFilled" className="text-white" size={16} />
            </View>
          </TouchableOpacity>
        </View>

        <View className="mt-8 px-5">
          {/* 닉네임 */}
          <Pressable
            onPress={navigateToNicknameChange}
            className="flex-row items-center justify-between border-b border-gray-100 py-4"
          >
            <View className="flex-1 flex-row items-center justify-between">
              <Text className="text-[15px] text-gray-500">닉네임</Text>
              <View className="flex-row items-center gap-4">
                <Text className="text-base font-medium text-gray-700">친절한 여행자</Text>
                <SvgIcon name="chevronRight" size={16} className="text-gray-300" />
              </View>
            </View>
          </Pressable>

          {/* 이메일 표시 */}
          <View className="flex-row items-center justify-between border-b border-gray-100 py-4">
            <Text className="text-[15px] text-gray-500">이메일</Text>
            <Text className="mr-2 text-base font-medium text-gray-700">test@email.com</Text>
          </View>
        </View>

        {/* 프로필 이미지 선택 바텀 시트 */}
        <ProfilePickerSheet
          isOpen={isOpenProfilePicker}
          onClose={() => setIsOpenProfilePicker(false)}
          onSelectGallery={handleGetPhoto}
          onSelectDefault={handleResetPhoto}
        />
      </View>
    </SafeScreen>
  )
}
