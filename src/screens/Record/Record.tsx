import { type RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'

import { useImagePicker } from '@/hooks/useImagePicker'
import { SafeScreen, TextField } from '@/shared'
import { RecordStackParamList } from '@/types/navigation'

import type { StackNavigationProp } from '@react-navigation/stack'

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

type RecordScreenNavigationProp = StackNavigationProp<RecordStackParamList, 'CreateRecord'>
type RecordScreenRouteProp = RouteProp<RecordStackParamList, 'CreateRecord'>

const RecordScreen = () => {
  const route = useRoute<RecordScreenRouteProp>()
  const navigation = useNavigation<RecordScreenNavigationProp>()
  const { photoPath } = route.params
  const [currentPhotoPath, setCurrentPhotoPath] = useState(photoPath)
  const [content, setContent] = useState('')
  const { pickImage } = useImagePicker()

  const handleTakePhoto = () => {
    navigation.navigate('CameraCapture')
  }

  const handlePickImage = async () => {
    const image = await pickImage()
    if (image && image.uri) {
      setCurrentPhotoPath(image.uri)
    }
  }

  const [activeMapType, setActiveMapType] = useState('tourist')
  const [activeCategory, setActiveCategory] = useState('tourist')

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

  return (
    <SafeScreen excludeEdges={['bottom']}>
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

        <View className="mb-4 h-64 items-center justify-center bg-gray-200">
          <Text>지도 영역</Text>
        </View>

        <View className="mb-4">
          <Text className="mb-2">부산광역시 해운대 좌동</Text>
          {currentPhotoPath && (
            <Image
              source={{ uri: `file://${currentPhotoPath}` }}
              className="mb-2 h-64 w-full rounded-lg"
              resizeMode="cover"
            />
          )}
          <View className="flex-row justify-between">
            <TouchableOpacity className="rounded bg-blue-500 px-4 py-2" onPress={handleTakePhoto}>
              <Text className="text-white">다시 촬영</Text>
            </TouchableOpacity>
            <TouchableOpacity className="rounded bg-blue-500 px-4 py-2" onPress={handlePickImage}>
              <Text className="text-white">갤러리에서 선택</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TextField
          value={content}
          onChangeText={setContent}
          placeholder="여행 기록을 작성해주세요."
          multiline
          className="h-32 rounded border border-gray-300 p-2"
        />

        <Text className="text-right text-gray-500">{content.length}/500</Text>
      </ScrollView>
    </SafeScreen>
  )
}

export default RecordScreen
