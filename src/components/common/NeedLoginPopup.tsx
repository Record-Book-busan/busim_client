import { type StackNavigationProp } from '@react-navigation/stack'
import { TouchableOpacity, View } from 'react-native'

import { defaultImageBlueGgilogbu } from '@/assets/images'
import { usePopup } from '@/hooks/usePopup'
import { ImageVariant, SvgIcon, Typo } from '@/shared'

import type { RootStackParamList } from '@/types/navigation'

interface NeedLoginPopupProps {
  navigation: StackNavigationProp<RootStackParamList>
}

export function NeedLoginPopup({ navigation }: NeedLoginPopupProps) {
  const { isOpen, closePopup } = usePopup()

  const handleLoginButtonClick = () => {
    closePopup()
    navigation.navigate('Login')
  }

  if (!isOpen) return

  return (
    <View
      style={{
        position: 'absolute',
        zIndex: 9999,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View className="absolute flex w-[340px] items-center justify-center gap-y-2 shadow">
        <View className="flex w-full items-center rounded-2xl bg-[#00339D] px-4 py-8">
          <ImageVariant
            className="-mb-[70px] -mt-[20px] h-[200px] w-[300px]"
            source={defaultImageBlueGgilogbu}
          />
          <Typo className="text-center text-sm font-medium text-white">
            나의 부산 여행록, 끼록:부
          </Typo>
          <Typo className="py-10 text-center font-SemiBold text-lg text-white">
            로그인이 필요한 기능입니다.
          </Typo>
          <TouchableOpacity
            className="flex w-full items-center justify-center rounded-full bg-white p-4"
            onPress={handleLoginButtonClick}
          >
            <Typo className="font-Bold text-neutral-800">지금 로그인하기</Typo>
          </TouchableOpacity>
        </View>
        <TouchableOpacity className="flex flex-row items-center gap-x-4" onPress={closePopup}>
          <Typo className="text-sm text-white">비회원으로 계속 볼래요</Typo>
          <SvgIcon className="text-white" size={14} name="chevronRight" />
        </TouchableOpacity>
      </View>
    </View>
  )
}
