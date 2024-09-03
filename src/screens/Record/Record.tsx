import React, { useRef, useState } from 'react'
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { Categories, KeyboardAvoidingView, SafeScreen } from '@/components/common'
import { useCamera } from '@/hooks/useCamera'
import { useGallery } from '@/hooks/useGallery'
import { TextArea, ImagePickerModal, SvgIcon, Button } from '@/shared'

const RecordScreen = () => {
  const scrollViewRef = useRef<KeyboardAwareScrollView>(null)

  const { takePhoto } = useCamera()
  const { getPhoto } = useGallery()
  const [content, setContent] = useState('')
  const [isImagePickerModalVisible, setIsImagePickerModalVisible] = useState(false)
  const [currentPhotoUri, setCurrentPhotoUri] = useState<string | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeCategory, setActiveCategory] = useState<number[]>([])

  const handleCategoryChange = (catId: number[]) => {
    console.log('선택한 카테고리 id:', catId)
    setActiveCategory(catId)
  }

  const handleTakePhoto = async () => {
    const photo = await takePhoto()
    if (photo && photo.uri) {
      setCurrentPhotoUri(photo.uri)
      setIsImagePickerModalVisible(false)
    }
  }

  const handleGetPhoto = async () => {
    const photo = await getPhoto()
    if (photo && photo.uri) {
      setCurrentPhotoUri(photo.uri)
      setIsImagePickerModalVisible(false)
    }
  }

  return (
    <SafeScreen>
      <KeyboardAvoidingView>
        <KeyboardAwareScrollView
          ref={scrollViewRef}
          enableOnAndroid
          enableAutomaticScroll={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, backgroundColor: 'white' }}
        >
          <View className="px-3 pt-4">
            <View className="mb-4 items-center justify-center">
              <TextInput className="text-xl font-bold" placeholder="여행 기록 제목" />
            </View>

            {/* 카테고리 */}
            <Categories onCategoryChange={handleCategoryChange} />

            {/* 지도 영역*/}
            <View className="my-4 h-48 items-center justify-center rounded-xl bg-gray-200">
              <Text>지도 영역</Text>
            </View>

            {/* 사진 영역 */}
            <View className="relative mb-4 items-center justify-center overflow-hidden rounded-xl border border-gray-300">
              {currentPhotoUri ? (
                <>
                  <Image
                    source={{ uri: currentPhotoUri }}
                    className="h-48 w-full"
                    resizeMode="cover"
                  />
                  <View className="absolute right-3 top-2">
                    <Button
                      buttonStyle="null"
                      textStyle="null"
                      pressedColor="null"
                      onPress={() => setCurrentPhotoUri(null)}
                    >
                      <SvgIcon name="trash" size={24} className="text-BUSIM-blue" />
                    </Button>
                  </View>
                </>
              ) : (
                <TouchableOpacity
                  className="z- h-48 w-full items-center justify-center rounded-xl bg-neutral-50"
                  onPress={() => setIsImagePickerModalVisible(true)}
                >
                  <Text className="mb-2 text-neutral-500">사진을 추가해주세요.</Text>
                  <SvgIcon name="add" />
                </TouchableOpacity>
              )}
            </View>

            <View className="mb-5">
              <TextArea
                size="lg"
                showCount
                maxLength={500}
                value={content}
                onChangeText={setContent}
                placeholder="여행 기록을 작성해주세요."
                multiline
                scrollEnabled={false}
                className="mb-4"
                onFocus={() => {
                  setTimeout(() => {
                    scrollViewRef?.current?.scrollToEnd()
                  }, 100)
                }}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>

        {/* 이미지 선택 액션 시트 */}
        <ImagePickerModal
          isVisible={isImagePickerModalVisible}
          onClose={() => setIsImagePickerModalVisible(false)}
          onGalleryPress={handleGetPhoto}
          onCameraPress={handleTakePhoto}
        />

        {/* 하단 버튼 영역 */}
        <View className={`relative bottom-0 left-0 right-0 bg-white px-3 pb-2 pt-2`}>
          <Button variant="primary" size="full">
            기록하기
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>
  )
}

export default RecordScreen
