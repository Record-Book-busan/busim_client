import { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { SvgIcon, Typo } from '@/shared'

interface DropBoxProps {
  items: string[]
  selected?: string
  width?: number
  height?: number
  onItemClick: (item: string) => void
}

export default function DropBox({ items, onItemClick, selected, width, height }: DropBoxProps) {
  const currentWidth = width || 96
  const currentHeight = height || 24
  const [selectedItem, setSelectedItem] = useState<string>(selected || items[0])
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleItemClick = (item: string) => {
    setSelectedItem(item)
    setIsOpen(false)
    onItemClick(item)
  }

  const handleToggleButtonClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <View className="relative flex gap-y-2">
      <TouchableOpacity
        onPress={handleToggleButtonClick}
        className="flex flex-row items-center justify-between rounded-full bg-[#00339D] px-4"
        style={{ width: currentWidth, height: currentHeight }}
      >
        <Typo className="text-xs text-white">{selectedItem}</Typo>
        <SvgIcon name="chevronRight" size={10} className="rotate-90 text-white" />
      </TouchableOpacity>
      {isOpen && items.length > 1 && (
        <View
          className="absolute z-50 rounded-2xl bg-BUSIM-slate-light py-1"
          style={{ top: currentHeight + 10, width: currentWidth }}
        >
          {items.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                className="w-full"
                onPress={() => handleItemClick(item)}
              >
                <Typo className="w-full py-1 text-center">{item}</Typo>
              </TouchableOpacity>
            )
          })}
        </View>
      )}
    </View>
  )
}
