import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet'
import { ReactNode, useEffect, useRef } from 'react'
import { View } from 'react-native'

import { Button, SvgIcon } from '@/shared'

interface BottomSheetProps {
  isOpen: boolean
  children: ReactNode
  onClose?: () => void
  snapPoints?: string[]
  showHandle?: boolean
  showCloseButton?: boolean
}

const SNAP_POINTS = ['30%']

const renderBackdropComponent = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop
    {...props}
    pressBehavior="close"
    /** Backdrop이 등장하기 시작하는 bottom sheet의 index */
    appearsOnIndex={0}
    /** Backdrop이 사라지기 시작하는 bottom sheet의 index */
    disappearsOnIndex={-1}
  />
)

export function BottomSheet({
  isOpen,
  onClose,
  children,
  snapPoints,
  showHandle = true,
  showCloseButton = false,
}: BottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null)

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.present()
      return () => {
        bottomSheetRef.current?.dismiss()
      }
    }

    bottomSheetRef.current?.dismiss()
    return () => {
      bottomSheetRef.current?.dismiss()
    }
  }, [bottomSheetRef.current])

  return (
    <BottomSheetModal
      backdropComponent={renderBackdropComponent}
      ref={bottomSheetRef}
      snapPoints={snapPoints || SNAP_POINTS}
      enablePanDownToClose
      onChange={index => index === -1 && onClose?.()}
      handleComponent={showHandle ? undefined : () => null}
    >
      <View className="relative">
        {showCloseButton && (
          <Button type="touch" onPress={onClose} className="absolute right-4 top-3 z-10">
            <SvgIcon name="x" size={20} className="text-gray-700" />
          </Button>
        )}
        {children}
      </View>
    </BottomSheetModal>
  )
}
