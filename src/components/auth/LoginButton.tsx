import { cva, type VariantProps } from 'class-variance-authority'
import { Text } from 'react-native'

import { SvgIcon } from '@/shared'
import { Button } from '@/shared/Button'
import { cn } from '@/utils/cn'

const buttonVariants = cva('relative flex-row items-center rounded-lg px-4 py-4', {
  variants: {
    provider: {
      apple: 'bg-black',
      kakao: 'bg-[#FEE500]',
      guest: 'bg-[#DBDCE5]',
    },
  },
})

const PressColorVariants = cva('opacity-80', {
  variants: {
    provider: {
      apple: 'bg-black',
      kakao: 'bg-[#FFEB33] opacity-100',
      guest: 'bg-[#DBDCE5]',
    },
  },
})

const textVariants = cva('flex-1 text-base text-center font-semibold', {
  variants: {
    provider: {
      apple: 'text-white font-semibold',
      kakao: 'text-black font-semibold',
      guest: 'text-black font-semibold',
    },
  },
})

type Provider = 'apple' | 'kakao' | 'guest'

interface LoginButtonProps extends VariantProps<typeof buttonVariants> {
  provider: Provider
  onPress: () => void
}

export function LoginButton({ provider, onPress }: LoginButtonProps) {
  const getText = (provider: Provider) => {
    switch (provider) {
      case 'apple':
        return 'Apple로 계속하기'
      case 'kakao':
        return '카카오로 계속하기'
      case 'guest':
        return '비회원으로 계속하기'
      default:
        return ''
    }
  }

  const getIconName = (provider: Provider) => {
    switch (provider) {
      case 'apple':
        return 'apple'
      case 'kakao':
        return 'kakao'
      case 'guest':
        return 'user'
      default:
        return 'user'
    }
  }

  return (
    <Button
      buttonStyle={cn(buttonVariants({ provider }))}
      pressedColor={cn(PressColorVariants({ provider }))}
      onPress={onPress}
      disableAnimation
    >
      <SvgIcon name={getIconName(provider)} size={24} className="text-black" />
      <Text className={cn(textVariants({ provider }))}>{getText(provider)}</Text>
    </Button>
  )
}
