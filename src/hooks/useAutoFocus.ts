import { useRef, useCallback } from 'react'
import { TextInput } from 'react-native'

/**
 * 여러 TextInput 컴포넌트 간의 포커스를 관리하는 커스텀 훅입니다.
 *
 * @param {number} inputCount - 관리할 TextInput 컴포넌트의 수
 * @returns {Object} inputRefs와 focusNextInput 함수를 포함하는 객체
 * @property {React.MutableRefObject<Array<React.RefObject<TextInput>>>} inputRefs - 각 TextInput에 대한 ref 배열
 * @property {(currentIndex: number) => void} focusNextInput - 다음 입력 필드로 포커스를 이동시키는 함수
 */
export const useAutoFocus = (inputCount: number) => {
  // 각 입력 필드에 대한 ref 배열 생성
  const inputRefs = useRef<Array<React.RefObject<TextInput>>>(
    Array(inputCount)
      .fill(null)
      .map(() => ({ current: null })),
  )

  /**
   * 다음 입력 필드로 포커스를 이동시키거나 마지막 필드의 포커스를 해제합니다.
   *
   * @param {number} currentIndex - 현재 입력 필드의 인덱스
   */
  const focusNextInput = useCallback(
    (currentIndex: number) => {
      if (currentIndex < inputCount - 1) {
        // 마지막 입력 필드가 아니라면 다음 필드로 포커스 이동
        inputRefs.current[currentIndex + 1]?.current?.focus()
      } else {
        // 마지막 입력 필드라면 포커스 해제
        inputRefs.current[currentIndex]?.current?.blur()
      }
    },
    [inputCount],
  )

  return { inputRefs, focusNextInput }
}
