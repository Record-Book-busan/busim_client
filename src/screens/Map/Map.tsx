import React, { useCallback, useEffect, useState } from 'react'
import { Platform, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { MapView } from '@/components/map'
import { SearchHeader } from '@/shared'

const HEADER_CONTENT_HEIGHT = 50
const HEADER_HEIGHT =
  Platform.OS === 'ios' ? HEADER_CONTENT_HEIGHT + 44 : HEADER_CONTENT_HEIGHT + 10

type MarkerTypeSelectionsProps = {
  title: string
  isSelected: boolean
  onPress: () => void
}

const MarkerTypeSelections = React.memo(
  ({ title, isSelected, onPress }: MarkerTypeSelectionsProps) => {
    return (
      <TouchableOpacity
        className={`mx-1 flex h-9 w-16 justify-center rounded-2xl border ${isSelected ? 'bg-[#2653B0]' : 'border-[#2653B0] bg-white'}`}
        onPress={onPress}
      >
        <Text className={`text-center text-xs ${isSelected ? 'text-white' : 'text-black'}`}>
          {title}
        </Text>
      </TouchableOpacity>
    )
  },
)

function MapScreen() {
  const insets = useSafeAreaInsets()
  const headerHeight = HEADER_HEIGHT + insets.top

  const [depth1_1, setDepth1_1] = useState(false)
  const [depth1_2, setDepth1_2] = useState(false)
  const handleDepth1_1Press = useCallback(() => setDepth1_1(prev => !prev), [])
  const handleDepth1_2Press = useCallback(() => setDepth1_2(prev => !prev), [])
  const depth1 = [
    { title: '관광지도', isSelected: depth1_1, onPress: handleDepth1_1Press },
    { title: '맛집지도', isSelected: depth1_2, onPress: handleDepth1_2Press },
  ]
  useEffect(() => {
    if (depth1_1) setDepth1_2(false)
  }, [depth1_1])
  useEffect(() => {
    if (depth1_2) setDepth1_1(false)
  }, [depth1_2])

  const [depth2_1, setDepth2_1] = useState(false)
  const [depth2_2, setDepth2_2] = useState(false)
  const [depth2_3, setDepth2_3] = useState(false)
  const [depth2_4, setDepth2_4] = useState(false)
  const [depth2_5, setDepth2_5] = useState(false)
  const [depth2_6, setDepth2_6] = useState(false)
  const [depth2_7, setDepth2_7] = useState(false)
  const [depth2_8, setDepth2_8] = useState(false)
  const handleDepth2_1Press = useCallback(() => setDepth2_1(prev => !prev), [])
  const handleDepth2_2Press = useCallback(() => setDepth2_2(prev => !prev), [])
  const handleDepth2_3Press = useCallback(() => setDepth2_3(prev => !prev), [])
  const handleDepth2_4Press = useCallback(() => setDepth2_4(prev => !prev), [])
  const handleDepth2_5Press = useCallback(() => setDepth2_5(prev => !prev), [])
  const handleDepth2_6Press = useCallback(() => setDepth2_6(prev => !prev), [])
  const handleDepth2_7Press = useCallback(() => setDepth2_7(prev => !prev), [])
  const handleDepth2_8Press = useCallback(() => setDepth2_8(prev => !prev), [])
  const depth2 = [
    { title: '관광지', type: 'first', isSelected: depth2_1, onPress: handleDepth2_1Press },
    { title: '자연', type: 'first', isSelected: depth2_2, onPress: handleDepth2_2Press },
    { title: '테마', type: 'first', isSelected: depth2_3, onPress: handleDepth2_3Press },
    { title: '레포츠', type: 'first', isSelected: depth2_4, onPress: handleDepth2_4Press },
    { title: '핫플', type: 'first', isSelected: depth2_5, onPress: handleDepth2_5Press },
    { title: '맛집', type: 'second', isSelected: depth2_6, onPress: handleDepth2_6Press },
    { title: '카페', type: 'second', isSelected: depth2_7, onPress: handleDepth2_7Press },
    { title: '술집', type: 'second', isSelected: depth2_8, onPress: handleDepth2_8Press },
  ]

  return (
    <View className="flex-1">
      <SearchHeader />
      <MapView />
      <View
        className="absolute left-0 right-0 z-50"
        style={{
          top: HEADER_HEIGHT,
          paddingTop: insets.top,
          height: headerHeight,
        }}
      >
        <View className="mb-1 flex w-full flex-row items-center justify-center">
          {depth1.map((item, index) => {
            return <MarkerTypeSelections key={index} {...item} />
          })}
        </View>
        <View className="flex w-full flex-row items-center justify-center">
          {depth2.map((item, index) => {
            if (depth1_1) {
              if (item.type === 'first') return <MarkerTypeSelections key={index} {...item} />
            } else if (depth1_2) {
              if (item.type === 'second') return <MarkerTypeSelections key={index} {...item} />
            }
          })}
        </View>
      </View>
    </View>
  )
}

export default MapScreen
