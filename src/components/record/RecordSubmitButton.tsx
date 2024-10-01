import { View } from 'react-native'

import { Button, Typo } from '@/shared'

interface RecordSubmitButtonProps {
  onSubmit: () => void
}

export const RecordSubmitButton = ({ onSubmit }: RecordSubmitButtonProps) => {
  return (
    <View className="w-full px-3 pb-2 pt-2">
      <Button variant="primary" type="button" size="full" onPress={onSubmit}>
        <Typo className="text-center font-SemiBold text-lg text-white">기록 하기</Typo>
      </Button>
    </View>
  )
}
