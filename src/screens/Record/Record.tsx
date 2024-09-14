import { useRef, useReducer, useEffect } from 'react'
import { View, Text, TextInput, ScrollView } from 'react-native'

import { KeyboardAvoidingView, SafeScreen } from '@/components/common'
import { MapDetail } from '@/components/map'
import { ImageUploader, initialState, recordFormReducer, useRecordForm } from '@/components/record'
import { useAutoFocus } from '@/hooks/useAutoFocus'
import { useLocation } from '@/hooks/useLocation'
import { useUploadImage } from '@/services/image'
import { useCreateRecord } from '@/services/record'
import { getLocationToAddr } from '@/services/service'
import { TextArea, SvgIcon, Button, Header } from '@/shared'

type RoadAddress = {
  address_name: string
  region_1depth_name: string
  region_2depth_name: string
  region_3depth_name: string
  road_name: string
  underground_yn: string
  main_building_no: string
  sub_building_no: string
  building_name: string
  zone_no: string
}

type Address = {
  address_name: string
  region_1depth_name: string
  region_2depth_name: string
  region_3depth_name: string
  mountain_yn: string
  main_address_no: string
  sub_address_no: string
  zip_code: string
}

type Document = {
  road_address: RoadAddress
  address: Address
}

type getLocationToAddrResponseType = {
  meta: {
    total_count: number
  }
  documents: Document[]
}

export default function RecordScreen() {
  const scrollViewRef = useRef<ScrollView>(null)
  const { inputRefs, focusNextInput } = useAutoFocus(4)
  const { mutateRecord } = useCreateRecord()
  const { mutateUpload } = useUploadImage()

  const { location, refreshLocation } = useLocation()
  const [state, dispatch] = useReducer(recordFormReducer, initialState)

  const { handleSubmit, updateRecordData } = useRecordForm(
    state,
    dispatch,
    mutateRecord,
    mutateUpload,
    scrollViewRef,
    inputRefs,
  )

  useEffect(() => {
    const getCurrentPosition = async () => {
      await refreshLocation()
      const response: getLocationToAddrResponseType = await getLocationToAddr({
        x: location.lng,
        y: location.lat,
      })

      dispatch({
        type: 'UPDATE_LOCATION',
        value: {
          name:
            response.documents[0].address.address_name ||
            response.documents[0].road_address.address_name,
          lat: location.lat,
          lng: location.lng,
        },
      })
    }

    void getCurrentPosition()
  }, [])

  return (
    <SafeScreen>
      <Header />
      <KeyboardAvoidingView edge="top">
        <ScrollView
          ref={scrollViewRef}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, backgroundColor: 'white' }}
          scrollEventThrottle={16}
        >
          <View className="px-3 pt-4">
            <View className="mb-4 items-center justify-center">
              <TextInput
                ref={inputRefs.current[0]}
                className={`text-xl font-bold`}
                placeholder="여행 기록 제목"
                value={state.title}
                onChangeText={text => updateRecordData('title', text)}
                onSubmitEditing={() => focusNextInput(0)}
              />
            </View>

            <View className="my-4 h-32">
              <MapDetail geometry={{ lon: state.location.lng, lat: state.location.lat }} />
            </View>
            <View className="mb-4 flex-row items-center">
              <View className="flex-row items-center">
                <SvgIcon name="marker" size={16} className="mr-3 text-neutral-400" />
                <Text className="text-sm text-gray-500">{state.location.name}</Text>
              </View>
            </View>

            <View ref={inputRefs.current[1]}>
              <ImageUploader
                uri={state.image?.uri}
                onImageSelected={uri => updateRecordData('image', uri)}
              />
            </View>

            <View className="mb-5">
              <TextArea
                ref={inputRefs.current[2]}
                size="lg"
                showCount
                maxLength={500}
                value={state.content}
                onChangeText={text => updateRecordData('content', text)}
                placeholder="여행 기록을 작성해주세요."
                multiline
                scrollEnabled={false}
                className="mb-4"
                onFocus={() => {
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true })
                  }, 100)
                }}
              />
            </View>
          </View>

          <View className="px-3 pb-2 pt-2">
            <Button variant="primary" type="button" size="full" onPress={handleSubmit}>
              기록하기
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  )
}
