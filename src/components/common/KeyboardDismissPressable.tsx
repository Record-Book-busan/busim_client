import { useRef } from 'react'
import { Keyboard, View } from 'react-native'
// @ts-expect-error - React Native internal module without type definitions
import * as TextInputState from 'react-native/Libraries/Components/TextInput/TextInputState'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

import type { PropsWithChildren } from 'react'

export function KeyboardDismissPressable({ children }: PropsWithChildren) {
  const isTargetTextInput = useRef(false)

  const tap = Gesture.Tap()
    // 스크롤 시 트리거가 되지 않도록, 탭 종료시 키보드 닫기
    .onEnd(() => {
      if (!isTargetTextInput.current) {
        Keyboard.dismiss()
      }
    })
    .runOnJS(true)

  return (
    <GestureDetector gesture={tap}>
      <View
        className="flex-1"
        onStartShouldSetResponderCapture={e => {
          // 텍스트를 입력할 때 키보드가 튀는 현상을 막기 위함
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          isTargetTextInput.current = TextInputState.isTextInput(e.target)

          return false
        }}
        accessible={false}
      >
        {children}
      </View>
    </GestureDetector>
  )
}
