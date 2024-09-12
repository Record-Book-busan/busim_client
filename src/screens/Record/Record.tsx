import { useRef, useState } from 'react'
import { View, Text, Image, TextInput } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Lightbox from 'react-native-lightbox-v2'

import { Categories, KeyboardAvoidingView, SafeScreen } from '@/components/common'
import { MapDetail } from '@/components/map'
import { ImagePickerSheet } from '@/components/record'
import { CategoryType, window } from '@/constants'
import { useCamera } from '@/hooks/useCamera'
import { useGallery } from '@/hooks/useGallery'
import { TextArea, SvgIcon, Button, Header } from '@/shared'
import { ButtonPrimitive } from '@/shared/Button'

const RecordScreen = () => {
  const scrollViewRef = useRef<KeyboardAwareScrollView>(null)

  const { takePhoto } = useCamera()
  const { getPhoto } = useGallery()
  const [content, setContent] = useState('')
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false)
  const [currentPhotoUri, setCurrentPhotoUri] = useState<string | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeCategory, setActiveCategory] = useState<CategoryType[]>([])

  const handleCategoryChange = (cat: CategoryType[]) => {
    setActiveCategory(cat)
    console.log('선택한 카테고리 id:', cat)
  }

  const handleTakePhoto = async () => {
    const photo = await takePhoto()
    if (photo && photo.uri) {
      setCurrentPhotoUri(photo.uri)
      setIsImagePickerOpen(false)
    }
  }

  const handleGetPhoto = async () => {
    const photo = await getPhoto()
    if (photo && photo.uri) {
      setCurrentPhotoUri(photo.uri)
      setIsImagePickerOpen(false)
    }
  }

  return (
    <SafeScreen>
      {/* 헤더 */}
      <Header />

      <KeyboardAvoidingView edge="top">
        <KeyboardAwareScrollView
          ref={scrollViewRef}
          enableOnAndroid
          enableAutomaticScroll={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, backgroundColor: 'white' }}
          scrollEventThrottle={16}
        >
          <View className="px-3 pt-4">
            <View className="mb-4 items-center justify-center">
              <TextInput className="text-xl font-bold" placeholder="여행 기록 제목" />
            </View>

            {/* 카테고리 */}
            <Categories onCategoryChange={handleCategoryChange} />

            {/* 지도 영역*/}
            <View className="my-4 h-48">
              <MapDetail geometry={{ lon: 128.1603, lat: 36.1587 }} />
            </View>
            <View className="mb-4 flex-row items-center">
              <View className="flex-row items-center">
                <SvgIcon name="marker" size={16} className="mr-3 text-neutral-400" />
                <Text className="text-sm text-gray-500">현재 위치</Text>
              </View>
            </View>

            {/* 사진 영역 */}
            <View className="relative mb-4 items-center justify-center overflow-hidden rounded-xl border border-gray-300">
              {currentPhotoUri ? (
                <View className="w-full">
                  <Lightbox
                    activeProps={{
                      style: {
                        width: window.width,
                        height: window.width,
                      },
                      resizeMode: 'contain',
                    }}
                  >
                    <Image
                      source={{ uri: currentPhotoUri }}
                      className="h-48 w-full"
                      resizeMode="cover"
                    />
                  </Lightbox>
                  <View className="absolute right-3 top-2">
                    <ButtonPrimitive onPress={() => setCurrentPhotoUri(null)}>
                      <SvgIcon name="trash" size={24} className="text-BUSIM-blue" />
                    </ButtonPrimitive>
                  </View>
                </View>
              ) : (
                <View className="z- h-48 w-full items-center justify-center rounded-xl">
                  <ButtonPrimitive onPress={() => setIsImagePickerOpen(true)}>
                    <SvgIcon name="add" className="text-BUSIM-blue" />
                  </ButtonPrimitive>
                  <Text className="mt-2 text-sm text-gray-800">사진 추가하기</Text>
                </View>
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
          {/* 하단 버튼 영역 */}
          <View className="px-3 pb-2 pt-2">
            <Button variant="primary" type="button" size="full">
              완료
            </Button>
          </View>
        </KeyboardAwareScrollView>

        {/* 이미지 선택 바텀 시트 */}
        <ImagePickerSheet
          isOpen={isImagePickerOpen}
          onClose={() => setIsImagePickerOpen(false)}
          onSelectGallery={handleGetPhoto}
          onSelectCamera={handleTakePhoto}
        />

        {/* 키보드가 올라올 때 보이는 버튼 */}
        {/* <View className={`relative bottom-0 left-0 right-0 px-3 pb-2 pt-2`}>
          <Button variant="primary" type="button" size="full">
            완료
          </Button>
        </View> */}
      </KeyboardAvoidingView>
    </SafeScreen>
  )
}

export default RecordScreen
