import { View } from 'react-native'

import { Button } from '@/shared'

interface RecordSubmitButtonProps {
  onSubmit: () => void
}

export const RecordSubmitButton = ({ onSubmit }: RecordSubmitButtonProps) => {
  return (
    <View className="px-3 pb-2 pt-2">
      <Button variant="primary" type="button" size="full" onPress={onSubmit}>
        기록하기
      </Button>
    </View>
  )
}
