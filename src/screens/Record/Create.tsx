import { useNavigation } from '@react-navigation/native'
import { useRef, useReducer } from 'react'
import { ScrollView, TextInput, View } from 'react-native'

import { KeyboardDismissPressable, SafeScreen } from '@/components/common'
import {
  RecordContent,
  RecordImage,
  RecordLocation,
  RecordSubmitButton,
  RecordTitle,
  useCreateRecordForm,
} from '@/components/record'
import { initialState, recordFormReducer } from '@/components/record'
import { useAutoFocus } from '@/hooks/useAutoFocus'
import { useUploadImage } from '@/services/image'
import { useCreateRecord } from '@/services/record'
import { Button, Header, SvgIcon } from '@/shared'

export default function RecordCreateScreen() {
  const navigation = useNavigation()
  const scrollViewRef = useRef<ScrollView>(null)
  const { inputRefs, focusNextInput } = useAutoFocus<TextInput | View>(4)
  const { mutateRecord } = useCreateRecord()
  const { mutateUpload } = useUploadImage()

  const [state, dispatch] = useReducer(recordFormReducer, initialState)

  const { updateRecordData, handleSubmit } = useCreateRecordForm(
    state,
    dispatch,
    mutateRecord,
    mutateUpload,
    scrollViewRef,
    inputRefs,
  )

  return (
    <SafeScreen className="bg-gray-100">
      <Header
        LeftContent={<View />}
        rightContent={
          <Button type="touch">
            <SvgIcon
              name="x"
              width={22}
              height={22}
              className="text-color-700"
              onPress={() => navigation.goBack()}
            />
          </Button>
        }
        containerStyle="bg-transparent"
      />
      <KeyboardDismissPressable>
        <ScrollView
          ref={scrollViewRef}
          keyboardShouldPersistTaps="handled"
          className="bg-gray-100 p-4"
          contentContainerStyle={{ flexGrow: 1 }}
          scrollEventThrottle={16}
        >
          <View className="mb-6 rounded-xl bg-white p-4 shadow-lg">
            <RecordTitle
              ref={inputRefs.current[0] as React.RefObject<TextInput>}
              title={state.title}
              onChangeTitle={text => updateRecordData('title', text)}
              onSubmitEditing={() => focusNextInput(3)}
            />

            <RecordImage
              ref={inputRefs.current[1] as React.RefObject<View>}
              uri={state.image?.uri}
              onImageSelected={uri => updateRecordData('image', uri)}
            />

            <View className="mt-4">
              <RecordContent
                content={state.content}
                onChangeContent={text => updateRecordData('content', text)}
                ref={inputRefs.current[3] as React.RefObject<TextInput>}
                scrollViewRef={scrollViewRef}
              />
            </View>
          </View>

          <View className="mb-4 rounded-lg bg-white p-3 shadow-sm">
            <RecordLocation location={state.location} dispatch={dispatch} />
          </View>

          <RecordSubmitButton onSubmit={handleSubmit} />
        </ScrollView>
      </KeyboardDismissPressable>
    </SafeScreen>
  )
}
