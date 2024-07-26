import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const Header = ({ title }: { title: string }) => {
  const insets = useSafeAreaInsets()
  return (
    <View
      style={{ paddingTop: insets.top }}
      className="border-b-[0.5px] border-gray-200/80 bg-white pb-3 pt-1"
    >
      <View className="flex-row items-center justify-center">
        <Text className="text-base font-bold text-gray-800">{title}</Text>
      </View>
    </View>
  )
}
