import { cva, type VariantProps } from 'class-variance-authority'
import { Text, View } from 'react-native'

import { cn } from '@/utils/cn'

import { CATEGORY, type CategoryKey } from '../../constants/data'

const tagVariants = cva('rounded-full min-w-[60px] px-5 py-2', {
  variants: {
    category: {
      관광지: 'bg-BUSIM-blue',
      자연: 'bg-BUSIM-summber-green',
      테마: 'bg-BUSIM-deep-lavender',
      레포츠: 'bg-BUSIM-ball-blue',
      핫플: 'bg-BUSIM-cherry',
      맛집: 'bg-BUSIM-beaver',
      카페: 'bg-BUSIM-thulian-pink',
      술집: 'bg-BUSIM-warm-pink',
    },
  },
  defaultVariants: {
    category: '관광지',
  },
})

const TextVariants = cva('text-center text-xs font-semibold leading-[0px]', {
  variants: {
    category: {
      관광지: 'text-white',
      자연: 'text-white',
      테마: 'text-white',
      레포츠: 'text-white',
      핫플: 'text-white',
      맛집: 'text-white',
      카페: 'text-white',
      술집: 'text-white',
    },
  },
  defaultVariants: {
    category: '관광지',
  },
})

interface TagProps extends VariantProps<typeof tagVariants> {
  catId: number
  tagStyle?: string
  textStyle?: string
  title?: string
}

export function Tag({ catId, tagStyle, title, textStyle }: TagProps) {
  const category = Object.keys(CATEGORY).find(key => CATEGORY[key as CategoryKey] === catId) as
    | CategoryKey
    | undefined

  const displayText = title || category

  return (
    <View className={cn(tagVariants({ category }), tagStyle)}>
      <Text className={cn(TextVariants({ category }), textStyle)}>{displayText}</Text>
    </View>
  )
}
