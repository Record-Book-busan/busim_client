import { memo, useCallback, useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { SvgIcon, Typo } from '@/shared'

interface DropBoxProps {
  items: string[]
  selected?: string
  width?: number
  height?: number
  onItemClick: (item: string) => void
}

const DropBox = memo(({ items, onItemClick, selected, width = 112, height = 28 }: DropBoxProps) => {
  const [selectedItem, setSelectedItem] = useState<string>(selected || items[0])
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
    setSelectedItem(selected || items[0])
  }, [items, selected])

  return (
    <View className="relative flex gap-y-2">
      <TouchableOpacity
        onPress={handleToggleButtonClick}
        className="flex flex-row items-center justify-between rounded-full bg-[#00339D] px-7"
        style={{ width, height }}
      >
        <Typo className="text-xs text-white">{selectedItem}</Typo>
        <SvgIcon name="chevronRight" size={10} className="rotate-90 text-white" />
      </TouchableOpacity>
      {isOpen && items.length > 1 && (
        <View
          className="absolute z-50 rounded-2xl bg-BUSIM-slate-light py-1"
          style={{ top: height + 10, width }}
        >
          {items.map((item, index) => (
            <TouchableOpacity key={index} className="w-full" onPress={() => handleItemClick(item)}>
              <Typo className="w-full py-1 text-center">{item}</Typo>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
})

export default DropBox
