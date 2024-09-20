import { useNavigation } from '@react-navigation/native'
import { type StackNavigationProp } from '@react-navigation/stack'
import { Text, TouchableOpacity, View, ScrollView, Linking, Pressable } from 'react-native'

import { SafeScreen } from '@/components/common'
import { logoutAll } from '@/services/auth'
import { Button, Header, ImageVariant, SvgIcon } from '@/shared'
import { type RootStackParamList } from '@/types/navigation'

export default function MyPageScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'MainTab'>>()

  const profileItem = {
    title: '내 정보 관리',
    onPress: () => navigation.navigate('MyPageStack', { screen: 'MyPageSettings' }),
  }
  const menuItems = [
    {
      title: '나의 여행 기록',
      onPress: () => navigation.navigate('MyPageStack', { screen: 'RecordList' }),
    },
    {
      title: '북마크',
      onPress: () => navigation.navigate('MyPageStack', { screen: 'BookMarkList' }),
    },
    {
      // FIXME: 배포 시 제거
      title: '테스트',
      onPress: () => navigation.navigate('MyPageStack', { screen: 'Test' }),
    },
  ]

  const settingsItems = [
    { title: '문의 및 지원', onPress: () => {} },
    { title: '도움말', onPress: () => {} },
    {
      title: '개인 정보 동의',
      onPress: () => {
        Linking.openURL(
          'https://ambitious-wavelength-253.notion.site/90044340c2804d058645e31a76c1740a',
        )
          .then(() => true)
          .catch(err => console.log(`Link 오류가 발생했습니다.: ${err}`))
      },
    },
    {
      title: '이용약관',
      onPress: () => {
        Linking.openURL(
          'https://ambitious-wavelength-253.notion.site/f794884e02ee42f098c94dba79999199?pvs=4',
        )
          .then(() => true)
          .catch(err => console.log(`Link 오류가 발생했습니다.: ${err}`))
      },
    },
  ]

  const handleLogoutPress = () => {
    logoutAll()
      .then(() => {
        navigation.navigate('Login')
      })
      .catch(err => console.log(`로그아웃 오류가 발생했습니다.: ${err}`))
  }

  const footerItems = [
    { title: '로그아웃', onPress: handleLogoutPress },
    { title: '회원탈퇴', onPress: () => {} },
  ]

  return (
    <SafeScreen>
      <Header title="마이페이지" LeftContent={<View className="w-10" />} />
      <ScrollView className="flex-1 bg-gray-100">
        <View className="mb-2 bg-white px-3 py-1">
          <ProfileHeader {...profileItem} />
          {menuItems.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </View>
        <View className="mb-2 flex-col bg-white px-3 py-1">
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

type MenuItemProps = {
  title: string
  onPress: () => void
}

const ProfileHeader = ({ onPress }: Pick<MenuItemProps, 'onPress'>) => (
  <Pressable onPress={onPress}>
    <View className="mb-2 mt-4 flex-row items-center justify-between">
      <View className="flex-row items-center">
        <ImageVariant
          className="mr-4 h-16 w-16 rounded-full bg-gray-300"
          source={{
            uri: 'https://avatars.githubusercontent.com/u/139189221?v=4',
          }}
          resizeMode="cover"
        />
        <Text className="text-xl font-semibold text-gray-950">ssunn113</Text>
      </View>
      <Pressable className="pr-1" onPress={onPress}>
        <SvgIcon name="setting" className="text-gray-400" />
      </Pressable>
    </View>
  </Pressable>
)

const MenuItem = ({ title, onPress }: MenuItemProps) => (
  <View className="flex-row items-center justify-between py-1">
    <Button onPress={onPress} type="text" variant="ghost">
      <Text className="text-base text-gray-600">{title}</Text>
      <SvgIcon name="chevronRight" size={14} className="text-gray-300" />
    </Button>
  </View>
)

const FooterButton = ({ title, onPress }: MenuItemProps) => (
  <TouchableOpacity onPress={onPress} className="py-4">
    <Text className="text-gray-500">{title}</Text>
  </TouchableOpacity>
)
