import { memo, useCallback, useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { SvgIcon, Typo } from '@/shared'

interface DropBoxProps {
  keys: string[]
  values: string[]
  selected?: string
  width?: number
  height?: number
  onItemClick: (item: string) => void
}

const DropBox = memo(
  ({ keys, values, onItemClick, selected, width = 128, height = 28 }: DropBoxProps) => {
    const [selectedItem, setSelectedItem] = useState<string>(selected || keys[0])
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const handleItemClick = useCallback(
      (item: string) => {
        setSelectedItem(item)
        setIsOpen(false)
        onItemClick(item)
      },
      [onItemClick],
    )

    const handleToggleButtonClick = useCallback(() => {
      setIsOpen(prev => !prev)
    }, [])

    useEffect(() => {
      setSelectedItem(selected || keys[0])
    }, [keys, selected])

    return (
      <View className="relative flex gap-y-2">
        <TouchableOpacity
          onPress={handleToggleButtonClick}
          className="flex flex-row items-center justify-between rounded-full bg-[#00339D] px-4"
          style={{ width, height }}
        >
          <Typo className="text-xs text-white">{keys[values.indexOf(selectedItem)]}</Typo>
          <SvgIcon name="chevronRight" size={10} className="rotate-90 text-white" />
        </TouchableOpacity>
        {isOpen && keys.length > 1 && (
          <View
            className="absolute z-50 flex justify-between rounded-2xl bg-BUSIM-slate-light py-2"
            style={{ top: height + 10, width }}
          >
            {keys.map((key, index) => (
              <TouchableOpacity
                key={index}
                className="w-full"
                onPress={() => handleItemClick(values[index])}
              >
                <Typo className="w-full px-3 py-0.5 text-center">{key}</Typo>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    )
  },
)

export default DropBox
