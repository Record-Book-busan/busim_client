import { cva } from 'class-variance-authority'
import { View } from 'react-native'

import { Typo } from '@/shared'
import { cn } from '@/utils/cn'

import { CATEGORY, getCategoryText, type CategoryKey } from '../../constants/data'

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
      default: 'bg-BUSIM-blue-light',
    },
  },
  defaultVariants: {
    category: 'default',
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
      default: 'text-blue-500',
    },
  },
  defaultVariants: {
    category: 'default',
  },
})

interface TagProps {
  category: string
  tagStyle?: string
  textStyle?: string
  title?: string
}

export function Tag({ category, tagStyle, title, textStyle }: TagProps) {
  // `CATEGORY` 내에 있는 값인지 확인하고, 해당 값을 가져옴
  const categoryKey = Object.keys(CATEGORY).find(
    key => CATEGORY[key as CategoryKey] === category,
  ) as CategoryKey | undefined
  const displayText = title || (categoryKey ? getCategoryText(CATEGORY[categoryKey]) : category)

  const style = categoryKey ? CATEGORY[categoryKey] : 'default'
  return (
    <View className={cn(tagVariants({ category: style }), tagStyle)}>
      <Typo className={cn(TextVariants({ category: style }), textStyle)}>{displayText}</Typo>
    </View>
  )
}
