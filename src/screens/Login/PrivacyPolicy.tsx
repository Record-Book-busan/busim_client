import { useNavigation } from '@react-navigation/native'
import { type StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { Text, TouchableOpacity, View, Linking } from 'react-native'

import { SafeScreen } from '@/components/common'
import { useNavigateWithPermissionCheck } from '@/hooks/useNavigationPermissionCheck'
import { usePostConsent } from '@/services/auth'
import { SvgIcon, Typo } from '@/shared'
import { AuthStackParamList } from '@/types/navigation'
import { storage } from '@/utils/storage'

const PRIVACY_CONTENTS = [
  {
    id: 'use',
    title: '끼록부 이용약관',
  },
  {
    id: 'personal',
    title: '끼록부 개인정보동의서',
  },
]

const handlerClickWhole = (type: string) => {
  switch (type) {
    case 'use':
      Linking.openURL(
        'https://ambitious-wavelength-253.notion.site/90044340c2804d058645e31a76c1740a',
      )
        .then(() => true)
        .catch(err => console.log(`Link 오류가 발생했습니다.: ${err}`))
      break
    case 'personal':
      Linking.openURL(
        'https://ambitious-wavelength-253.notion.site/f794884e02ee42f098c94dba79999199?pvs=4',
      )
        .then(() => true)
        .catch(err => console.log(`Link 오류가 발생했습니다.: ${err}`))
      break
  }
}

function PrivacyPolicyScreen() {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'OnBoardingStack'>>()
  const { navigateWithPermissionCheck } = useNavigateWithPermissionCheck()
  const postConsent = usePostConsent()
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [notice, setNotice] = useState('')

  const handleCheckItem = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleCheckAll = () => {
    const allChecked = PRIVACY_CONTENTS.every(item => checkedItems[item.id])
    const newState = PRIVACY_CONTENTS.reduce(
      (acc, item) => {
        acc[item.id] = !allChecked
        return acc
      },
      {} as Record<string, boolean>,
    )
    setCheckedItems(newState)
  }

  const makeAlert = async (message: string) => {
    setNotice(message)
    await new Promise(res => setTimeout(res, 1000))
    setNotice('')
  }

  const moveInterestTourHandler = () => {
    const moverInterestTour = async () => {
      const allChecked = PRIVACY_CONTENTS.every(item => checkedItems[item.id])

      if (allChecked) {
        storage.set('isAgreed', true)

        try {
          const response = await postConsent()
          console.log(response)
          navigateWithPermissionCheck({
            navigation,
            routeName: 'OnBoardingStack',
            params: {
              screen: 'OnBoarding',
            },
          })
        } catch {
          throw new Error('이용 약관 동의 실패')
        }
      } else {
        void makeAlert('모든 이용 약관에 대한 동의가 필요합니다.')
      }
    }

    moverInterestTour()
  }

  const allChecked = PRIVACY_CONTENTS.every(item => checkedItems[item.id])

  return (
    <SafeScreen excludeEdges={['top']}>
      {!!notice && (
        <View className="absolute left-[12.5%] top-2 z-10 w-4/5 flex-row items-center rounded-xl border border-[#FF0000] bg-[#FFF0F0] px-3 py-4">
          <SvgIcon name="notice" />
          <Text className="ml-2 text-sm font-semibold text-black">{notice}</Text>
        </View>
      )}
      <Typo className="absolute top-1/4 w-full text-center text-xl font-bold">이용 약관 동의</Typo>
      <View className="absolute left-1/2 top-1/2 flex h-[160px] w-[380px] -translate-x-[190px] -translate-y-[80px] rounded-2xl border border-[#DBDCE5]">
        <CheckboxItem
          title="전체 동의"
          checked={allChecked}
          onPress={handleCheckAll}
          containerStyle="px-4 py-3"
          textStyle="text-lg font-bold text-gray-800"
        />
        <View className="flex w-full items-center justify-center border-t-2 border-[#DBDCE5] px-6 pt-4">
          {PRIVACY_CONTENTS.map(item => (
            <PrivacyItem
              key={item.id}
              item={item}
              checked={checkedItems[item.id]}
              onPress={() => handleCheckItem(item.id)}
            />
          ))}
        </View>
      </View>

      <View className="absolute top-2/3 flex w-full items-center">
        <TouchableOpacity
          className="flex h-10 w-32 justify-center rounded-2xl bg-[#2653B0]"
          onPress={moveInterestTourHandler}
        >
          <Text className="text-center text-sm text-white">확인</Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  )
}

interface CheckboxItemProps {
  title: string
  checked: boolean
  onPress: () => void
  containerStyle?: string
  textStyle?: string
}

const CheckboxItem: React.FC<CheckboxItemProps> = ({
  title,
  checked,
  onPress,
  containerStyle = '',
  textStyle = '',
}) => (
  <View className={`flex flex-row items-center gap-2 ${containerStyle}`}>
    <TouchableOpacity onPress={onPress}>
      <SvgIcon name={checked ? 'checked' : 'unchecked'} className="py-4" />
    </TouchableOpacity>
    <Text className={textStyle}>{title}</Text>
  </View>
)

interface PrivacyItemProps {
  item: (typeof PRIVACY_CONTENTS)[0]
  checked: boolean
  onPress: () => void
}

const PrivacyItem: React.FC<PrivacyItemProps> = ({ item, checked, onPress }) => (
  <View className="flex flex-row items-start">
    <CheckboxItem title="" checked={checked} onPress={onPress} />
    <View className="flex-1 py-0.5">
      <View className="flex flex-row items-center gap-1">
        <Text className="text-base text-BUSIM-blue">[필수]</Text>
        <Text className="text-base font-bold">{item.title}</Text>
        <TouchableOpacity onPress={() => handlerClickWhole(item.id)}>
          <Text className="ml-4 text-[#96979E]">전체 {'>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
)

export default PrivacyPolicyScreen
