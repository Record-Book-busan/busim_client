import { Pressable } from 'react-native'

import { SvgIcon } from '@/shared'

type EyeButtonProps = {
  eyeState: boolean
  onPress: () => void
}

export function EyeButton({ eyeState, onPress }: EyeButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`aspect-square h-9 w-9 items-center justify-center rounded-full shadow-sm ${eyeState ? 'bg-black' : 'bg-white'}`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <SvgIcon
        name={eyeState ? 'eyeClose' : 'eyeOpen'}
        className={eyeState ? 'text-neutral-50' : 'text-gray-600'}
        size={18}
      />
    </Pressable>
  )
}
