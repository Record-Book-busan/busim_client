import type { NavigatorScreenParams } from '@react-navigation/native'
import type { StackScreenProps } from '@react-navigation/stack'

export type RootStackParamList = {
  Login: undefined
  MainTab: undefined
  RecordStack: NavigatorScreenParams<RecordStackParamList>
  MyPageStack: NavigatorScreenParams<MyPageStackParamList>
}

export type MainTabParamList = {
  Map: undefined
  Feed: undefined
  MyPage: undefined
}

export type MapStackParamList = {
  MapHome: undefined
  MapRecommend: undefined
}

export type RecordStackParamList = {
  RecordFeed: undefined
  CreateRecord: undefined
}

export type MyPageStackParamList = {
  MyPageProfile: undefined
  MyPageSettings: undefined
}

export type RootScreenProps<S extends keyof RootStackParamList = keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, S>
