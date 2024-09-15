import { type NavigationProp, type RouteProp, useNavigation } from '@react-navigation/native'

import { SafeScreen } from '@/components/common'
import { MapDetailContent } from '@/components/map'
import { FAB, SvgIcon } from '@/shared'

import type { RootStackParamList, MapStackParamList } from '@/types/navigation'

interface MapDetailScreenProps {
  route: RouteProp<MapStackParamList, 'MapDetail'>
}

export default function MapDetailScreen({ route }: MapDetailScreenProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'SearchStack'>>()

  const handleButtonPress = (id: number) => {
    navigation.navigate('RecordStack', {
      screen: 'ReadRecord',
      params: { id },
    })
  }

  return (
    <SafeScreen excludeEdges={['top']}>
      <FAB
        position={'topCenter'}
        buttonStyle="bg-white rounded-full px-5 py-2 shadow-md"
        rightAddon={<SvgIcon name="arrowRightBlack" />}
        onPress={() => handleButtonPress(route.params.id)}
      >
        여행기록 보러가기
      </FAB>
      <MapDetailContent id={route.params.id} type={route.params.type} />
    </SafeScreen>
  )
}
