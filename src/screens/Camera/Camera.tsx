import { useIsFocused, useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { Camera } from 'react-native-vision-camera'

import { useCamera } from '@/hooks/useCamera'
import { useIsForeground } from '@/hooks/useIsForeground'

import type { RecordStackParamList } from '@/types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'

type CameraScreenNavigationProp = StackNavigationProp<RecordStackParamList, 'CameraCapture'>

function CameraScreen() {
  const {
    device,
    hasPermission,
    changeCameraPosition,
    takePhoto,
    savePhoto,
    photo,
    resetCamera,
    checkCameraPermission,
    cameraRef,
  } = useCamera()
  const [isCameraInitialized, setIsCameraInitialized] = useState(false)
  const isFocused = useIsFocused()
  const navigation = useNavigation<CameraScreenNavigationProp>()

  const isFocussed = useIsFocused()
  const isForeground = useIsForeground()
  const isActive = isFocussed && isForeground

  useEffect(() => {
    const initializeCamera = async () => {
      try {
        await checkCameraPermission()
      } catch (error) {
        console.error('Failed to initialize camera:', error)
      }
    }
    void initializeCamera()
  }, [checkCameraPermission])

  useEffect(() => {
    if (isFocused) {
      resetCamera()
    }
  }, [isFocused])

  const handleTakePhoto = async () => {
    if (isCameraInitialized) {
      await takePhoto()
    }
  }

  const handleUsePhoto = async () => {
    if (photo) {
      await savePhoto()
      navigation.navigate('CreateRecord', { photoPath: photo.path })
    }
  }

  if (!device) return <Text className="text-center">카메라를 사용할 수 없는 기기 입니다.</Text>
  if (!hasPermission) return <Text className="text-center">카메라 권한이 필요합니다.</Text>

  return (
    <View className="flex-1">
      {photo ? (
        <View className="flex-1">
          <Image source={{ uri: `file://${photo.path}` }} className="flex-1" />
          <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between p-5">
            <TouchableOpacity className="rounded-md bg-black/50 p-3" onPress={resetCamera}>
              <Text className="text-white">Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity className="rounded-md bg-black/50 p-3" onPress={handleUsePhoto}>
              <Text className="text-white">Use Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <Camera
            ref={cameraRef}
            style={{ flex: 1 }}
            device={device}
            isActive={isActive}
            photo
            onInitialized={() => setIsCameraInitialized(true)}
          />
          <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between p-5">
            <TouchableOpacity className="rounded-md bg-black/50 p-3" onPress={changeCameraPosition}>
              <Text className="text-white">Flip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="h-16 w-16 items-center justify-center rounded-full bg-white/50"
              onPress={handleTakePhoto}
            >
              <View className="h-14 w-14 rounded-full bg-white" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  )
}

export default CameraScreen
