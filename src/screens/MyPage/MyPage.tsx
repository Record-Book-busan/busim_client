import { type ReactNode } from 'react'
import { Text, TouchableOpacity, View, ScrollView } from 'react-native'

import { ImageVariant, SafeScreen, SvgIcon } from '@/shared'

type MenuItemProps = {
  title: string
  onPress: () => void
}

type SectionProps = {
  children: ReactNode
}

const MenuItem = ({ title, onPress }: MenuItemProps) => (
  <TouchableOpacity onPress={onPress} className="flex-row items-center justify-between py-4">
    <Text className="text-base text-gray-700">{title}</Text>
    <SvgIcon name="chevronRight" className="text-gray-400" size={14} />
  </TouchableOpacity>
)

const Section = ({ children }: SectionProps) => (
  <View className="mb-2 bg-white px-5 py-1">{children}</View>
)

const FooterButton = ({ title, onPress }: MenuItemProps) => (
  <TouchableOpacity onPress={onPress} className="py-4">
    <Text className="text-gray-500">{title}</Text>
  </TouchableOpacity>
)

const ProfileHeader = () => (
  <View className="mb-2 mt-4 flex-row items-center justify-between">
    <View className="flex-row items-center">
      <ImageVariant
        className="mr-4 h-16 w-16 rounded-full bg-gray-300"
        source={{
          uri: 'https://avatars.githubusercontent.com/u/139189221?v=4',
        }}
        resizeMode="cover"
      />
      <Text className="text-xl font-medium text-gray-700">ssunn113</Text>
    </View>
    <TouchableOpacity>
      <SvgIcon name="setting" className="text-gray-400" />
    </TouchableOpacity>
  </View>
)

function MyPageScreen() {
  const menuItems = [
    { title: '기록한 여행 사진', onPress: () => {} },
    { title: '북마크', onPress: () => {} },
  ]

  const settingsItems = [
    { title: '문의 및 지원', onPress: () => {} },
    { title: '도움말', onPress: () => {} },
    { title: '어플 버전', onPress: () => {} },
    { title: '개인 정보 동의', onPress: () => {} },
    { title: '언어 설정', onPress: () => {} },
    { title: '이용약관', onPress: () => {} },
  ]

  const footerItems = [
    { title: '로그아웃', onPress: () => {} },
    { title: '회원탈퇴', onPress: () => {} },
  ]

  return (
    <SafeScreen excludeEdges={['top']}>
      <ScrollView className="flex-1 bg-gray-100">
        <Section>
          <ProfileHeader />
          {menuItems.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </Section>
        <Section>
          {settingsItems.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </Section>
        <View className="flex-row px-5 g-3">
          {footerItems.map((item, index) => (
            <FooterButton key={index} {...item} />
          ))}
        </View>
      </ScrollView>
    </SafeScreen>
  )
}

export default MyPageScreen
