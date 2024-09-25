import { useEffect, useState } from 'react'
import { Image, ImageURISource, ScrollView, Text, View } from 'react-native'
import Lightbox from 'react-native-lightbox-v2'

import { window } from '@/constants'
import { validateImageUri } from '@/services/image'
import { useRecordDetail } from '@/services/record'
import { SvgIcon } from '@/shared'

const { width } = window

export function RecordDetailContent({ id }: { id: number }) {
  const { data: record } = useRecordDetail(id)
  const [imageUri, setImageUri] = useState<ImageURISource>()

  useEffect(() => {
    const fetchImageUri = async () => {
      const validImageUri = await validateImageUri(
        record.thumbnailUrl !== null ? record.thumbnailUrl : undefined,
      )
      setImageUri(validImageUri)
    }

    fetchImageUri()
  }, [record.thumbnailUrl])

  return (
    <ScrollView className="flex-1">
      {/* 이미지 */}
      <View style={{ width, height: width }}>
        <Lightbox
          activeProps={{
            style: { width: '100%', height: '100%' },
            resizeMode: 'contain',
          }}
        >
          <Image source={imageUri} className="h-full w-full" />
        </Lightbox>
      </View>

      <View className="p-4">
        {/* 위치 정보 */}
        <View className="mb-4 flex-row items-center">
          <SvgIcon name="marker" size={16} className="mr-3 text-neutral-400" />
          <Text className="text-sm text-gray-500">{record.address}</Text>
        </View>
        {/* 내용 */}
        {/* <Text className="mb-6 text-base text-gray-700">{record.content}</Text> */}
      </View>
    </ScrollView>
  )
}
