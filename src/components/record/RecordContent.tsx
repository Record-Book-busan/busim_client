import React, { forwardRef } from 'react'
import { View, ScrollView, TextInput } from 'react-native'

import { TextArea } from '@/shared'

interface RecordContentProps {
  content: string
  onChangeContent: (text: string) => void
  scrollViewRef: React.RefObject<ScrollView>
}

export const RecordContent = forwardRef<TextInput, RecordContentProps>(
  ({ content, onChangeContent, scrollViewRef }, ref) => {
    return (
      <View className="mb-3">
        <TextArea
          ref={ref}
          size="lg"
          showCount
          maxLength={500}
          value={content}
          onChangeText={onChangeContent}
          placeholder="여행 기록을 작성해주세요"
          multiline
          scrollEnabled={false}
          containerStyle="bg-gray-100 p-4 border-0 rounded-2xl"
          onFocus={() => {
            setTimeout(() => {
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }, 100)
          }}
        />
      </View>
    )
  },
)

RecordContent.displayName = 'RecordContent'
