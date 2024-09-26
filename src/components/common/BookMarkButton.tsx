import { useState } from 'react'
import { TouchableOpacity } from 'react-native'

import { useDeleteRecordBookMark, usePostRecordBookMark } from '@/services/record'
import { SvgIcon } from '@/shared/SvgIcon'
import { theme } from '@/theme'

interface Props {
  id?: number
  size?: number
  isBookMarked: boolean
  onPress: () => void
}

export const BookmarkButton = ({ id, isBookMarked, size, onPress }: Props) => {
  const [isPressed, setIsPressed] = useState(isBookMarked)
  const postRecordBookMark = usePostRecordBookMark()
  const deleteRecordBookMark = useDeleteRecordBookMark()

  const handlePress = () => {
    onPress?.()
    setIsPressed(!isPressed)

    if (id) {
      if (isPressed) postRecordBookMark(id)
      else deleteRecordBookMark(id)
    }
  }

  return (
    <TouchableOpacity onPress={handlePress}>
      <SvgIcon
        name="bookmark"
        size={size}
        stroke={isPressed ? theme.colors['BUSIM-blue'] : 'white'}
        className={`h-6 w-6 ${isPressed ? 'text-BUSIM-blue' : 'text-transparent'}`}
      />
    </TouchableOpacity>
  )
}
