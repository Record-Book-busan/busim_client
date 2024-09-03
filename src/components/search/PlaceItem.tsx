import { Text, TouchableOpacity, View } from 'react-native'

import { SvgIcon } from '@/shared'

type PlaceItemProps = {
  id: string
  title: string
  position: string
  onPressDel: (id: string) => void
  onPressMove: (id: string) => void
}

export function PlaceItem({ id, title, position, onPressDel, onPressMove }: PlaceItemProps) {
  return (
    <TouchableOpacity
      className="flex w-full flex-row border-y border-y-[#DBDCE5] px-2 py-4"
      onPress={() => onPressMove(id)}
    >
      <View className="flex flex-auto">
        <Text className="text-lg font-bold">{title}</Text>
        <View className="flex flex-row items-center">
          <SvgIcon name="markerBorderBlue" />
          <Text className="ml-1">{position}</Text>
        </View>
      </View>
      <TouchableOpacity className="z-50" onPress={() => onPressDel(id)}>
        <SvgIcon name="xCircle" />
      </TouchableOpacity>
    </TouchableOpacity>
  )
}
