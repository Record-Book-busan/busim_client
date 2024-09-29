import { useState } from 'react'
import { Text, View } from 'react-native'

import { KeyboardDismissPressable, SafeScreen } from '@/components/common'
import { useNickNameUpdate } from '@/components/user'
import { Button, TextField, Typo } from '@/shared'

export default function NickNameSetting() {
  const [nickName, setNickName] = useState('')
  const { mutate: updateNickName } = useNickNameUpdate()

  const handleChangeNickName = (text: string) => {
    setNickName(text)
  }

  const handleSubmit = () => {
    updateNickName(nickName)
  }

  return (
    <SafeScreen excludeEdges={['top', 'bottom']}>
      <KeyboardDismissPressable>
        <View className="flex-1">
          <View className="mt-8 px-5">
            <Text className="mb-2 font-sans text-sm text-gray-600">닉네임</Text>
            <View className="mb-2 w-full flex-row items-center space-x-2">
              <View className="flex-1">
                <TextField
                  placeholder="닉네임 입력"
                  value={nickName}
                  onChangeText={handleChangeNickName}
                />
              </View>
            </View>
          </View>

          <View className="mt-2 items-center justify-center">
            <View className="w-full px-5">
              <Button type="button" variant="primary" size="full" onPress={handleSubmit}>
                <Typo className="text-center font-SemiBold text-lg text-white">저장</Typo>
              </Button>
            </View>
          </View>
        </View>
      </KeyboardDismissPressable>
    </SafeScreen>
  )
}
