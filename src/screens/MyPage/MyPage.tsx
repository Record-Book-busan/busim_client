import { useNavigation } from '@react-navigation/native'
import { type StackNavigationProp } from '@react-navigation/stack'
import { Text, View, ScrollView, Linking, Pressable } from 'react-native'

import { SafeScreen } from '@/components/common'
import { UserInfoItem } from '@/components/user'
import { useAuth } from '@/hooks/useAuthContext'
import { useGetUserInfo } from '@/services/user'
import { Button, Header, SvgIcon } from '@/shared'
import { type AuthStackParamList } from '@/types/navigation'

export default function MyPageScreen() {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'MainTab'>>()
  const { signOut, unRegister, state } = useAuth()
  const { resetUserInfo } = useGetUserInfo()

  const menuItems = () => {
    const results = []

    if (state.role !== 'GUEST') {
      results.push({
        title: '나의 여행 기록',
        onPress: () =>
          navigation.navigate('MyPageStack', {
            screen: 'RecordList',
          }),
      })
    }

    return results
  }

  const settingsItems = [
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
    const handleLogout = async () => {
      try {
        await signOut()
        resetUserInfo()
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      } catch (err) {
        if (err instanceof Error) {
          console.log(`로그아웃 오류가 발생했습니다.: ${err.message}`)
        }
      }
    }

    handleLogout()
  }

  const handleCancelMembershipPress = () => {
    const handleCancelMembership = async () => {
      try {
        await unRegister()
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      } catch (err) {
        if (err instanceof Error) {
          console.log(`회원탈퇴 중 오류가 발생했습니다.: ${err.message}`)
        }
      }
    }

    handleCancelMembership()
  }

  const footerItems = () => {
    const results = [{ title: '로그아웃', onPress: handleLogoutPress }]

    if (state.role !== 'GUEST' && state.role !== 'SHARE') {
      results.push({ title: '회원탈퇴', onPress: handleCancelMembershipPress })
    }

    return results
  }

  return (
    <SafeScreen>
      <Header title="마이페이지" LeftContent={<View className="w-10" />} />
      <ScrollView className="flex-1 bg-gray-100">
        <View className="mb-2 bg-white px-3 pb-2 pt-1">
          <UserInfoItem />
        </View>
        <View className="mb-2 bg-white px-3 py-1">
          {menuItems().map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
          {settingsItems.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </View>
        <View className="flex-row px-5 g-3">
          {footerItems().map((item, index) => (
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

const MenuItem = ({ title, onPress }: MenuItemProps) => (
  <View className="flex-row items-center justify-between py-1">
    <Button onPress={onPress} type="text" variant="ghost">
      <Text className="text-base text-gray-600">{title}</Text>
      <SvgIcon name="chevronRight" size={14} className="text-gray-300" />
    </Button>
  </View>
)

const FooterButton = ({ title, onPress }: MenuItemProps) => (
  <Pressable onPress={onPress} className="py-4">
    <Text className="text-gray-500">{title}</Text>
  </Pressable>
)
