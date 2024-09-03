import { Text, View } from 'react-native'

import { SafeScreen } from '@/components/common'
import { SvgIcon } from '@/shared'
import { Button } from '@/shared/Button/Button'
import { FAB } from '@/shared/FAB'

export default function Test() {
  return (
    <SafeScreen>
      <View className="flex-1 bg-white">
        {/* <View className="flex-row p-8">
        <Chip title="관광지" isSelected={false} onPress={() => setSelected(false)} />
        <Chip title="테스트" isSelected={true} />
        <Chip title="자연" isSelected={true} />
      </View> */}
        <View className="h-12 flex-row items-center bg-neutral-300 px-4">
          <Text className="text-base font-semibold">type: container, variant: default</Text>
        </View>
        <View className="flex-col p-8" style={{ gap: 10 }}>
          <Text className="text-sm">size: sm</Text>
          <Button size="sm" variant="primary">
            sm button
          </Button>
          <Text className="text-sm">size: md, buttonStyle: border-2</Text>
          <Button size="md" buttonStyle="border-2">
            mid button
          </Button>
          <Text className="text-sm">size: lg, textStyle: text-yellow-500</Text>
          <Button size="lg" textStyle="text-yellow-500">
            lg button
          </Button>
          <Text className="text-sm">size: full, disabled: true</Text>
          <Button size="full" variant="primary" disabled>
            full button
          </Button>
        </View>
        <View className="h-12 flex-row items-center bg-neutral-300 px-4">
          <Text className="text-base font-semibold">type: inner, variant: ghost</Text>
        </View>
        <View className="flex-col p-8" style={{ gap: 10 }}>
          <Button type="inner" variant="ghost" size="sm">
            sm button
          </Button>
          <Button type="inner" variant="ghost">
            <Text className="text-base text-gray-600">list button</Text>
            <SvgIcon name="chevronRight" size={14} className="text-gray-400" />
          </Button>
        </View>
        <FAB position="bottomLeft" onPress={() => console.log('FAB pressed')}>
          <SvgIcon name="camera" />
        </FAB>
        <FAB
          size="small"
          rightAddon={<SvgIcon name="camera" size={28} />}
          onPress={() => console.log('FAB pressed')}
        >
          여행 기록 보러가기
        </FAB>
      </View>
    </SafeScreen>
  )
}
