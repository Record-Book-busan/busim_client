import { useState } from 'react'
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { useCamera } from '@/hooks/useCamera'
import { useGallery } from '@/hooks/useGallery'
import { TextArea, ImagePickerModal, SafeScreen, SvgIcon } from '@/shared'

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
  const [isImagePickerModalVisible, setIsImagePickerModalVisible] = useState(false)

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
    <SafeScreen excludeEdges={['top']}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'ios' ? 50 : 40}
        className="bg-white"
      >
        <View className="flex-1 px-4 pb-10 pt-4">
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

          <View className="px-2">
            {/* 지도 영역 */}
            <View className="mb-4 h-48 items-center justify-center rounded-xl bg-gray-200">
              <Text>지도 영역</Text>
            </View>

            {/* 사진 영역 */}
            <View className="flex items-center justify-center">
              {currentPhotoUri ? (
                <Image
                  source={{ uri: currentPhotoUri }}
                  className="h-64 w-full rounded-lg"
                  resizeMode="cover"
                />
              ) : (
                <TouchableOpacity
                  className="w-full"
                  onPress={() => setIsImagePickerModalVisible(true)}
                >
                  <View className="mb-4 h-48 w-full items-center justify-center rounded-xl border border-gray-300 bg-neutral-50 text-base">
                    <Text className="text-neutral-500">사진을 추가해주세요.</Text>

                    <SvgIcon name="add" />
                  </View>
                </TouchableOpacity>
              )}
            </View>

            <ImagePickerModal
              isVisible={isImagePickerModalVisible}
              onClose={() => setIsImagePickerModalVisible(false)}
              onGalleryPress={handleGetPhoto}
              onCameraPress={handleTakePhoto}
            />

            {/* 기록 영역 */}
            <TextArea
              size="lg"
              showCount
              maxLength={500}
              value={content}
              onChangeText={setContent}
              placeholder="여행 기록을 작성해주세요."
              multiline
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeScreen>
  )
}

export default RecordScreen
