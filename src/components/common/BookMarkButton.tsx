import { useState } from 'react'
import { TouchableOpacity } from 'react-native'

import { SvgIcon } from '@/shared/SvgIcon'
import { theme } from '@/theme'

interface Props {
  size?: number
  isBookMarked: boolean
  onPress: () => void
}

export const BookmarkButton = ({ isBookMarked, size, onPress }: Props) => {
  const [isPressed, setIsPressed] = useState(isBookMarked)

  const handlePress = () => {
    onPress?.()
    setIsPressed(!isPressed)
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
