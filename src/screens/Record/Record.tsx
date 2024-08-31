/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'

import { useCamera } from '@/hooks/useCamera'
import { useGallery } from '@/hooks/useGallery'
import { KeyboardDismissPressable, SafeScreen, TextField } from '@/shared'

const ToggleButton = ({
  title,
  isActive,
  onPress,
}: {
  title: string
  isActive: boolean
  onPress: () => void
}) => (
  <TouchableOpacity
    className={`mr-2 rounded-full px-4 py-2 shadow ${isActive ? 'bg-blue-500' : 'border border-blue-500'}`}
    onPress={onPress}
  >
    <Text className={isActive ? 'text-white' : 'text-gray-700'}>{title}</Text>
  </TouchableOpacity>
)

const RecordScreen = () => {
  const { takePhoto } = useCamera()
  const { getPhoto } = useGallery()
  const [content, setContent] = useState('')
  const [activeMapType, setActiveMapType] = useState('tourist')
  const [activeCategory, setActiveCategory] = useState('tourist')

  const [currentPhotoUri, setCurrentPhotoUri] = useState<string | null>(null)

  const mapTypes = [
    { id: 'tourist', title: '관광지도' },
    { id: 'food', title: '맛집지도' },
  ]

  const categories = [
    { id: 'tourist', title: '관광지' },
    { id: 'nature', title: '자연' },
    { id: 'theme', title: '테마' },
    { id: 'leisure', title: '레포츠' },
    { id: 'hotplace', title: '핫플' },
  ]

  const handleTakePhoto = async () => {
    const photo = await takePhoto()

    if (photo && photo.uri) {
      setCurrentPhotoUri(photo.uri)
    }
  }

  const handleGetPhoto = async () => {
    const photo = await getPhoto()
    if (photo && photo.uri) {
      setCurrentPhotoUri(photo.uri)
    }
  }

  return (
    <SafeScreen excludeEdges={['top', 'bottom']}>
      <KeyboardDismissPressable>
        <View className="flex-1 bg-white">
          <ScrollView className="flex-1 p-4">
            <Text className="mb-4 text-xl font-bold">여행 기록 제목</Text>
            <View>
              <View className="mb-4 flex-row justify-center">
                {mapTypes.map(type => (
                  <ToggleButton
                    key={type.id}
                    title={type.title}
                    isActive={activeMapType === type.id}
                    onPress={() => setActiveMapType(type.id)}
                  />
                ))}
              </View>

              <View className="mb-4 flex-row flex-wrap justify-center">
                {categories.map(category => (
                  <ToggleButton
                    key={category.id}
                    title={category.title}
                    isActive={activeCategory === category.id}
                    onPress={() => setActiveCategory(category.id)}
                  />
                ))}
              </View>
            </View>

            {/* 지도 영역 */}
            <View className="mb-4 h-64 items-center justify-center bg-gray-200">
              <Text>지도 영역</Text>
            </View>

            {/* 사진 영역 */}
            <View className="mb-4">
              {currentPhotoUri && (
                <Image
                  source={{ uri: currentPhotoUri }}
                  className="mb-2 h-64 w-full rounded-lg"
                  resizeMode="cover"
                />
              )}
            </View>

            {/* 기록 영역 */}
            <TextField
              value={content}
              onChangeText={setContent}
              placeholder="여행 기록을 작성해주세요."
              multiline
              className="h-32 rounded border border-gray-300 p-2"
            />

            <Text className="text-right text-gray-500">{content.length}/500</Text>
          </ScrollView>
        </View>
      </KeyboardDismissPressable>
    </SafeScreen>
  )
}

export default RecordScreen
