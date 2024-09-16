import { Pressable, TouchableOpacityProps } from 'react-native'

import { type IconName, SvgIcon } from '@/shared'
import { cn } from '@/utils/cn'

interface MapFABProps extends TouchableOpacityProps {
  iconName: IconName
  className?: string
  enabled?: boolean
}

export function MapFAB({ iconName, className, enabled, ...props }: MapFABProps) {
  return (
    <Pressable
      className={cn(
        'aspect-square h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm',
        className,
      )}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
      {...props}
    >
      <SvgIcon name={iconName} className={enabled ? 'text-[#006dfe]' : 'text-gray-600'} size={20} />
    </Pressable>
  )
}
