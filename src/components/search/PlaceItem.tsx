import { View } from 'react-native'

import { SvgIcon, Typo } from '@/shared'
import { Button, ButtonPrimitive } from '@/shared/Button'

type PlaceItemProps = {
  id: number
  title: string
  address?: string
  onPressDel: (id: number) => void
  onPressMove: (id: number) => void
}

export function PlaceItem({ id, title, address, onPressDel, onPressMove }: PlaceItemProps) {
  return (
    <ButtonPrimitive animationConfig={{ toValue: 0.99 }} onPress={() => onPressMove(id)}>
      <View className="flex-row items-center justify-between border-b border-neutral-200 py-3.5">
        <View className="flex-1">
          <Typo className="mb-1 font-SemiBold text-base text-gray-800">{title}</Typo>
          {address && (
            <View className="flex-row items-center">
              <SvgIcon name="marker" className="text-gray-400" size={14} />
              <Typo className="ml-1 text-sm leading-[0px] text-gray-500">{address}</Typo>
            </View>
          )}
        </View>
        <Button className="z-50" onPress={() => onPressDel(id)}>
          <SvgIcon name="x" className="text-gray-500" size={18} />
        </Button>
      </View>
    </ButtonPrimitive>
  )
}
