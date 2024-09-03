import { useState } from 'react'

import { Button } from '@/shared/Button'
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
    <Button onPress={handlePress} animationConfig={{ toValue: 0.93 }}>
      <SvgIcon
        name="bookmarkWhite"
        className={`h-6 w-6 ${isPressed ? 'text-BUSIM-blue' : 'text-transparent'}`}
      />
    </Button>
  )
}
