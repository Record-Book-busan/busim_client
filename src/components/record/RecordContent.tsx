import React from 'react'
import { View, ScrollView, TextInput } from 'react-native'

import { TextArea } from '@/shared'

interface RecordContentProps {
  content: string
  onChangeContent: (text: string) => void
  inputRef: React.RefObject<TextInput>
  scrollViewRef: React.RefObject<ScrollView>
}

export const RecordContent = ({
  content,
  onChangeContent,
  inputRef,
  scrollViewRef,
}: RecordContentProps) => {
  return (
    <View className="mb-5 px-3">
      <TextArea
        ref={inputRef}
        size="lg"
        showCount
        maxLength={500}
        value={content}
        onChangeText={onChangeContent}
        placeholder="여행 기록을 작성해주세요."
        multiline
        scrollEnabled={false}
        className="mb-4"
        onFocus={() => {
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }, 100)
        }}
      />
    </View>
  )
}
