import { cva, type VariantProps } from 'class-variance-authority'
import { View } from 'react-native'

import { Typo } from '@/shared'
import { cn } from '@/utils/cn'

import { CATEGORY, CategoryType, type CategoryKey } from '../../constants/data'

const tagVariants = cva('rounded-full min-w-[60px] px-5 py-1.5', {
  variants: {
    category: {
      [CATEGORY.관광지]: 'bg-BUSIM-blue-dark',
      [CATEGORY.자연]: 'bg-BUSIM-summber-green',
      [CATEGORY.테마]: 'bg-BUSIM-deep-lavender',
      [CATEGORY.레포츠]: 'bg-BUSIM-ball-blue',
      [CATEGORY.핫플]: 'bg-BUSIM-cherry',
      [CATEGORY.맛집]: 'bg-BUSIM-beaver',
      [CATEGORY.특별한_맛집]: 'bg-BUSIM-thulian-pink',
    },
  },
  defaultVariants: {
    category: CATEGORY.관광지,
  },
})

const TextVariants = cva('text-center text-[13px] font-Medium leading-normal', {
  variants: {
    category: {
      [CATEGORY.관광지]: 'text-white',
      [CATEGORY.자연]: 'text-white',
      [CATEGORY.테마]: 'text-white',
      [CATEGORY.레포츠]: 'text-white',
      [CATEGORY.핫플]: 'text-white',
      [CATEGORY.맛집]: 'text-white',
      [CATEGORY.특별한_맛집]: 'text-white',
    },
  },
  defaultVariants: {
    category: CATEGORY.관광지,
  },
})

interface TagProps extends VariantProps<typeof tagVariants> {
  category: CategoryType
  tagStyle?: string
  textStyle?: string
  title?: string
}

export function Tag({ category, tagStyle, title, textStyle }: TagProps) {
  const categoryKey = Object.keys(CATEGORY).find(
    key => CATEGORY[key as CategoryKey] === category,
  ) as CategoryKey | undefined

  const displayText = title || categoryKey

  return (
    <View className={cn(tagVariants({ category }), tagStyle)}>
      <Typo className={cn(TextVariants({ category }), textStyle)}>{displayText}</Typo>
    </View>
  )
}
