import { useState } from 'react'
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native'

import { KeyboardDismissPressable, SafeScreen } from '@/components/common'
import { useGallery } from '@/hooks/useGallery'
import { SvgIcon } from '@/shared'
import { TextField } from '@/shared/TextField'

function ProfileEditScreen() {
  const [nickname, setNickname] = useState('')
  const [profileImage, setProfileImage] = useState<string | undefined>()
  const { getPhoto } = useGallery()

  const handleGetPhoto = async () => {
    const image = await getPhoto()
    if (image && image.uri) {
      setProfileImage(image.uri)
    }
  }

  return (
    <SafeScreen>
      <KeyboardDismissPressable>
        <View className="flex-1 bg-white">
          <View className="mt-12 items-center">
            <Text className="mb-2 text-base text-gray-900">프로필 사진</Text>
            <TouchableOpacity className="relative" onPress={handleGetPhoto}>
              <View className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-gray-300 bg-neutral-100">
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={{ width: '100%', height: '100%' }} />
                ) : (
                  <SvgIcon name="person" fill="#D0D0D0" />
                )}
              </View>
              <View className="absolute bottom-0 right-0 rounded-full border border-gray-300 bg-white p-1">
                <SvgIcon name="pencil" fill="#FF9278" />
              </View>
            </TouchableOpacity>
          </View>

          <View className="mt-8 px-5">
            <Text className="mb-2 text-sm text-gray-900">닉네임</Text>
            <View className="mb-2 w-full flex-row items-center space-x-2">
              <View className="flex-1">
                <TextField
                  placeholder="친절한 여행자"
                  value={nickname}
                  onChangeText={text => setNickname(text)}
                />
              </View>
              <TouchableOpacity
                className="flex h-12 items-center justify-center rounded-xl bg-gray-200 px-6"
                onPress={() => Alert.alert('중복 확인')}
              >
                <Text className="text-sm text-gray-500">중복 확인</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-xs text-red-500">
              영문 소문자와 숫자만 사용하여, 영문 소문자로 시작하는 4~12자의 아이디를 입력해주세요.
            </Text>
          </View>

          {/* <View className="mb-4 mt-14 flex-row justify-center">
        <TouchableOpacity className="w-2/6 rounded-full border-2 border-gray-300 bg-white py-2 shadow">
          <Text className="text-center text-base font-semibold text-gray-400">저장</Text>
        </TouchableOpacity>
      </View> */}

          <View className="mb-4 flex-1 justify-end px-4">
            <TouchableOpacity className="rounded-xl bg-blue-500 py-3">
              <Text className="text-center text-base font-bold text-white">저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardDismissPressable>
    </SafeScreen>
  )
}

export default ProfileEditScreen
