import React from 'react'
import { View, TextInput } from 'react-native'

interface RecordTitleProps {
  title: string
  onChangeTitle: (text: string) => void
  inputRef: React.RefObject<TextInput>
  onSubmitEditing: () => void
}

export const RecordTitle = ({
  title,
  onChangeTitle,
  inputRef,
  onSubmitEditing,
}: RecordTitleProps) => {
  return (
    <View className="mb-4 items-center justify-center px-3 pt-4">
      <TextInput
        ref={inputRef}
        className={`text-xl font-bold`}
        placeholder="여행 기록 제목"
        value={title}
        onChangeText={onChangeTitle}
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  )
}
