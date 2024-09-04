import { type NavigationProp, useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { SafeScreen } from '@/components/common'
import { SvgIcon } from '@/shared'
import { RootStackParamList } from '@/types/navigation'

const PRIVACY_CONTENTS = [
  {
    id: 'use',
    title: '끼록부 이용약관',
    content: `<끼록부> 은(는) 개인정보 보호법 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리지침을 수립․공개합니다.

    제1조(개인정보의 처리목적)

    <끼록부>은(는) 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.

    1. 홈페이지 회원 가입 및 관리

    회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별․인증, 회원자격 유지․관리, 제한적 본인확인제 시행에 따른 본인확인, 서비스 부정이용 방지, 만 14세 미만 아동의 개인정보 처리시 법정대리인의 동의여부 확인, 각종 고지․통지, 고충처리 등을 목적으로 개인정보를 처리합니다.

    ...`,
  },
  {
    id: 'personal',
    title: '끼록부 개인정보동의서',
    content: `제 1 장 총 칙

    제 1 조 (목적)

    이 약관은 {끼록부}(이하 "사이트"라 합니다)에서 제공하는 인터넷서비스(이하 "서비스"라 합니다)의 이용 조건 및 절차에 관한 기본적인 사항을 규정함을 목적으로 합니다.

    제 2 조 (약관의 효력 및 변경)

    ① 이 약관은 서비스 화면이나 기타의 방법으로 이용고객에게 공지함으로써 효력을 발생합니다.

    ② 사이트는 이 약관의 내용을 변경할 수 있으며, 변경된 약관은 제1항과 같은 방법으로 공지 또는 통지함으로써 효력을 발생합니다.

    ...`,
  },
]

function PrivacyPolicyScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'OnBoardingStack'>>()
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

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

  const moveInterestTourHandler = () => {
    navigation.navigate('OnBoardingStack', { screen: 'OnBoarding' })
  }

  const allChecked = PRIVACY_CONTENTS.every(item => checkedItems[item.id])

  return (
    <SafeScreen excludeEdges={['top']}>
      <CheckboxItem
        title="전체 동의"
        checked={allChecked}
        onPress={handleCheckAll}
        containerStyle="mt-3 bg-white px-4 py-3"
        textStyle="text-lg font-medium text-gray-800"
      />

      <View className="mb-4 w-full border-t-[1px] border-[#DBDCE5] bg-white px-4 py-5">
        {PRIVACY_CONTENTS.map(item => (
          <PrivacyItem
            key={item.id}
            item={item}
            checked={checkedItems[item.id]}
            onPress={() => handleCheckItem(item.id)}
          />
        ))}
      </View>

      <View className="flex w-full items-center">
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
  <View className="mb-4 flex flex-row gap-2">
    <CheckboxItem title="" checked={checked} onPress={onPress} />
    <View className="flex-1">
      <View className="flex flex-row items-center gap-1">
        <Text className="text-base text-BUSIM-blue">[필수]</Text>
        <Text className="text-base font-medium">{item.title}</Text>
        <TouchableOpacity>
          <Text className="ml-4 text-[#96979E]">전체 {'>'}</Text>
        </TouchableOpacity>
      </View>
      <View className="my-2 h-52 rounded-2xl border p-4">
        <ScrollView>
          <Text>{item.content}</Text>
        </ScrollView>
      </View>
    </View>
  </View>
)

export default PrivacyPolicyScreen
