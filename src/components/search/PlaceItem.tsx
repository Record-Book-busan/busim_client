import { Text, View } from 'react-native'

import { SvgIcon } from '@/shared'
import { Button, ButtonPrimitive } from '@/shared/Button'

type PlaceItemProps = {
  id: number
  title: string
  position: string
  onPressDel: (id: number) => void
  onPressMove: (id: number) => void
}

export function PlaceItem({ id, title, position, onPressDel, onPressMove }: PlaceItemProps) {
  return (
    <ButtonPrimitive animationConfig={{ toValue: 0.99 }} onPress={() => onPressMove(id)}>
      <View className="mx-5 flex-row items-center justify-between border-b border-neutral-100 py-3.5">
        <View className="flex-1">
          <Text className="mb-1 text-base font-semibold text-gray-800">{title}</Text>
          <View className="flex-row items-center">
            <SvgIcon name="marker" className="text-gray-400" size={12} />
            <Text className="ml-1 text-sm leading-[0px] text-gray-500">{position}</Text>
          </View>
        </View>
        <Button className="z-50" onPress={() => onPressDel(id)}>
          <SvgIcon name="x" className="text-gray-500" size={18} />
        </Button>
      </View>
    </ButtonPrimitive>
  )
}
