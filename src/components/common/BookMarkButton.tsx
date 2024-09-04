import { useState } from 'react'
import { TouchableOpacity } from 'react-native'

import { SvgIcon } from '@/shared/SvgIcon'

interface Props {
  isBookMarked: boolean
  onPress: () => void
}

export const BookmarkButton = ({ isBookMarked = false, onPress }: Props) => {
  const [isPressed, setIsPressed] = useState(isBookMarked)

  const handlePress = () => {
    onPress?.()
    setIsPressed(!isPressed)
  }

  return (
    <TouchableOpacity onPress={handlePress}>
      <SvgIcon
        name="bookmarkWhite"
        className={`h-6 w-6 ${isPressed ? 'text-BUSIM-blue' : 'text-white'}`}
      />
    </TouchableOpacity>
  )
}
