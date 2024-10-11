import { TouchableOpacity, View } from 'react-native'

import { defaultImageWhiteGgilogbu } from '@/assets/images'
import { ImageVariant, Typo } from '@/shared'

interface GuestPopupProps {
  onPress: (isShare: boolean) => void
}

export function GuestPopup({ onPress }: GuestPopupProps) {
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
        <View className="flex w-full items-center rounded-2xl bg-white px-4 py-8">
          <ImageVariant
            className="-mb-[40px] -mt-[10px] h-[150px] w-[250px]"
            source={defaultImageWhiteGgilogbu}
          />
          <View className="flex items-center justify-center pb-8 pt-10">
            <Typo className="font-SemiBold text-sm text-black">회원 기능을 체험해 볼 수 있는</Typo>
            <Typo className="font-SemiBold text-sm text-black">
              공유 로그인 기능을 활성화 하실 수 있습니다.
            </Typo>
            <Typo className="font-SemiBold text-sm text-black">활성화 하시겠습니까?</Typo>
          </View>
          <View className="flex w-full flex-row justify-center gap-x-4">
            <TouchableOpacity
              className="flex w-[40%] items-center justify-center rounded-lg bg-[#00339d] px-4 py-3"
              onPress={() => onPress(true)}
            >
              <Typo className="font-Bold text-sm text-white">활성화</Typo>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex w-[40%] items-center justify-center rounded-lg bg-white px-4 py-3"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
              onPress={() => onPress(false)}
            >
              <Typo className="font-Bold text-sm text-neutral-800">비회원으로 계속</Typo>
            </TouchableOpacity>
          </View>
          <View className="flex items-center justify-center pt-8">
            <Typo className="font-SemiBold text-sm text-neutral-500">
              비활성화 선택 시, 비회원으로 접속되며
            </Typo>
            <Typo className="font-SemiBold text-sm text-neutral-500">
              일부 기능 사용이 제한됩니다.
            </Typo>
          </View>
        </View>
      </View>
    </View>
  )
}
