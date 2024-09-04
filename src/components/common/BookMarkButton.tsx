import { useState } from 'react'
import { TouchableOpacity } from 'react-native'

import { SvgIcon } from '@/shared/SvgIcon'

interface Props {
  onPress: () => void
}

export const BookmarkButton = ({ onPress }: Props) => {
  const [isPressed, setIsPressed] = useState(false)

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
