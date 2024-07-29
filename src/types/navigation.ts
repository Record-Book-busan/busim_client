import type { NavigatorScreenParams } from '@react-navigation/native'
import type { StackScreenProps } from '@react-navigation/stack'

export type RootStackParamList = {
  MainTab: NavigatorScreenParams<MainTabParamList>
  Record: NavigatorScreenParams<RecordStackParamList>
  MyPage: NavigatorScreenParams<MyPageStackParamList>
}

export type MainTabParamList = {
  Map: undefined
  Camera: undefined
  MyPage: undefined
}

export type MapStackParamList = {
  MapHome: undefined
  MapRecommend: undefined
}

export type RecordStackParamList = {
  CameraCapture: undefined
  CreatePost: undefined
}

export type MyPageStackParamList = {
  MyPageProfile: undefined
  MyPageSettings: undefined
}

export type RootScreenProps<S extends keyof RootStackParamList = keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, S>
