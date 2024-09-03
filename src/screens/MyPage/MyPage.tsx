import { useNavigation } from '@react-navigation/native'
import { type StackNavigationProp } from '@react-navigation/stack'
import { Text, TouchableOpacity, View, ScrollView } from 'react-native'

import { Button, ImageVariant, SafeScreen, SvgIcon } from '@/shared'
import { type RootStackParamList } from '@/types/navigation'

type MenuItemProps = {
  title: string
  onPress: () => void
}

const MenuItem = ({ title, onPress }: MenuItemProps) => (
  <Button onPress={onPress} type="inner" variant="ghost">
    <Text className="text-base text-gray-600">{title}</Text>
    <SvgIcon name="chevronRight" size={14} className="text-gray-400" />
  </Button>
)

const FooterButton = ({ title, onPress }: MenuItemProps) => (
  <TouchableOpacity onPress={onPress} className="py-4">
    <Text className="text-gray-500">{title}</Text>
  </TouchableOpacity>
)

const ProfileHeader = ({ onPress }: Pick<MenuItemProps, 'onPress'>) => (
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
    <TouchableOpacity onPress={onPress}>
      <SvgIcon name="setting" className="text-gray-400" />
    </TouchableOpacity>
  </View>
)

function MyPageScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'MainTab'>>()

  const profileItem = {
    title: '프로필 설정',
    onPress: () => {
      console.log('Navigating to MyPageProfile')
      navigation.navigate('MyPageStack', { screen: 'MyPageProfile' })
    },
  }
  const menuItems = [
    { title: '기록한 여행 사진', onPress: () => {} },
    { title: '북마크', onPress: () => {} },
    {
      title: '테스트',
      onPress: () => {
        navigation.navigate('MyPageStack', { screen: 'Test' })
      },
    },
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
        <View className="mb-2 bg-white px-3 py-1">
          <ProfileHeader {...profileItem} />
          {menuItems.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </View>
        <View className="mb-2 flex-col bg-white px-3 py-1" style={{ gap: 5 }}>
          {settingsItems.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </View>
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
