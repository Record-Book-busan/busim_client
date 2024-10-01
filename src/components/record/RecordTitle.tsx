import React, { forwardRef } from 'react'
import { View, TextInput, TextInputProps } from 'react-native'

import { Typo } from '@/shared'

interface RecordTitleProps extends TextInputProps {
  title: string
  onChangeTitle: (text: string) => void
}

export const RecordTitle = forwardRef<TextInput, RecordTitleProps>(
  ({ title, onChangeTitle, onSubmitEditing, ...rest }, ref) => {
    return (
      <View className="mb-4 border-b-2 border-gray-200 pb-2">
        <Typo className="mb-2 font-SemiBold text-lg text-neutral-700">✏️ 여행 기록 쓰기</Typo>
        <TextInput
          ref={ref}
          className="font-SemiBold text-xl tracking-tight text-neutral-800"
          placeholder="여행 기록 제목을 해주세요"
          value={title}
          multiline={true}
          onChangeText={onChangeTitle}
          onSubmitEditing={onSubmitEditing}
          textAlignVertical="top"
          {...rest}
        />
      </View>
    )
  },
)

RecordTitle.displayName = 'RecordTitle'
