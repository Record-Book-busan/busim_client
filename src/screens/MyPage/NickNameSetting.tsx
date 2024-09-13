import { useState } from 'react'
import { Text, View } from 'react-native'

import { KeyboardDismissPressable, SafeScreen } from '@/components/common'
// import { useUpdateUserInfo } from '@/services/user'
import { Button, TextField } from '@/shared'

export default function NickNameSetting() {
  const [nickName, setNickName] = useState('')
  // const { mutateUserInfo } = useUpdateUserInfo()

  const handleChangeNickName = (text: string) => {
    setNickName(text)
  }

  return (
    <SafeScreen excludeEdges={['top']}>
      <KeyboardDismissPressable>
        <View className="mt-10 px-5">
          <Text className="mb-2 font-sans text-sm text-gray-600">닉네임</Text>
          <View className="mb-2 w-full flex-row items-center space-x-2">
            <View className="flex-1">
              <TextField
                placeholder="recordbook"
                value={nickName}
                onChangeText={handleChangeNickName}
              />
            </View>
          </View>
          <Text className="text-xs text-slate-500">
            영문 소문자와 숫자만 사용하여, 영문 소문자로 시작하는 4~12자의 아이디를 입력해주세요.
          </Text>
        </View>

        <View className="mt-20 items-center justify-center">
          <View className="w-2/5">
            <Button buttonStyle="rounded-full border-2 border-gray-300 bg-white py-2 shadow">
              <Text className="flex-1 justify-center text-center text-base font-semibold text-gray-400">
                저장
              </Text>
            </Button>
          </View>
        </View>

        {/* <View className="mb-4 flex-1 justify-end px-4">
          <Button type="button" variant="primary" size="full">
            <Text className="text-center text-base font-bold text-white">저장</Text>
          </Button>
        </View> */}
      </KeyboardDismissPressable>
    </SafeScreen>
  )
}
