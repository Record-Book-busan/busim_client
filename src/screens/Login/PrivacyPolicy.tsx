import { useNavigation } from '@react-navigation/native'
import { type StackNavigationProp } from '@react-navigation/stack'
import { useState } from 'react'
import { ScrollView, Pressable, View } from 'react-native'

import { SafeScreen } from '@/components/common'
import { SvgIcon, Typo } from '@/shared'
import { RootStackParamList } from '@/types/navigation'

export default function PrivacyPolicyScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'OnBoardingStack'>>()
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    age: false,
    marketing: false,
  })

  const handleToggleAgreement = (key: keyof typeof agreements) => {
    if (key === 'all') {
      const newValue = !agreements.all
      setAgreements({
        all: newValue,
        terms: newValue,
        privacy: newValue,
        age: newValue,
        marketing: newValue,
      })
    } else {
      setAgreements(prev => {
        const newAgreements = { ...prev, [key]: !prev[key] }
        const allChecked = Object.entries(newAgreements).every(([k, v]) => k === 'all' || v)
        return { ...newAgreements, all: allChecked }
      })
    }
  }

  const AgreementItem = ({
    title,
    isChecked,
    onToggle,
    isRequired = true,
  }: {
    title: string
    isChecked: boolean
    onToggle: () => void
    isRequired?: boolean
  }) => (
    <Pressable className="flex-row items-center justify-between py-3" onPress={onToggle}>
      <View className="flex-row items-center">
        {isRequired && <Typo className="ml-1 text-base text-BUSIM-blue">[필수] </Typo>}
        <Typo className="text-base text-gray-800">{title}</Typo>
      </View>
      <SvgIcon
        name={isChecked ? 'checked' : 'unchecked'}
        size={24}
        color={isChecked ? 'bg-BUSIM-blue-dark' : '#D1D5DB'}
      />
    </Pressable>
  )

  return (
    <SafeScreen>
      <ScrollView className="flex-1 px-6">
        <View className="pb-4 pt-8">
          <Typo className="mb-2 font-Bold text-xl text-gray-800">서비스 이용을 위해</Typo>
          <Typo className="mb-4 font-Bold text-xl text-gray-800">이용약관 동의가 필요합니다.</Typo>
        </View>

        <Pressable
          className="flex-row items-center justify-between border-b border-gray-200 py-4"
          onPress={() => handleToggleAgreement('all')}
        >
          <Typo className="font-Bold text-lg text-gray-800">전체 동의</Typo>
          <SvgIcon
            name={agreements.all ? 'checked' : 'unchecked'}
            size={24}
            color={agreements.all ? '#8B5CF6' : '#D1D5DB'}
          />
        </Pressable>

        <AgreementItem
          title="서비스 이용약관에 동의합니다"
          isChecked={agreements.terms}
          onToggle={() => handleToggleAgreement('terms')}
        />
        <AgreementItem
          title="개인정보 수집 및 이용에 동의합니다"
          isChecked={agreements.privacy}
          onToggle={() => handleToggleAgreement('privacy')}
        />

        <Pressable
          className={`mt-8 rounded-full py-4 ${agreements.terms && agreements.privacy && agreements.age ? 'bg-BUSIM-blue-dark' : 'bg-gray-300'}`}
          disabled={!agreements.terms || !agreements.privacy || !agreements.age}
          onPress={() =>
            navigation.navigate('OnBoardingStack', {
              screen: 'OnBoarding',
            })
          }
        >
          <Typo className="text-center font-Bold text-lg text-white">다음</Typo>
        </Pressable>
      </ScrollView>
    </SafeScreen>
  )
}
