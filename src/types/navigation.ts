import type { NavigatorScreenParams } from '@react-navigation/native'
import type { StackScreenProps } from '@react-navigation/stack'

export type RootStackParamList = {
  Login: undefined
  PrivacyPolicy: undefined
  OnBoardingStack: NavigatorScreenParams<OnboardingStackParamList>
  MainTab: NavigatorScreenParams<MainTabParamList>
  RecordStack: NavigatorScreenParams<RecordStackParamList>
  MyPageStack: NavigatorScreenParams<MyPageStackParamList>
  SearchStack: NavigatorScreenParams<SearchStackParamList>
}

export type OnboardingStackParamList = {
  OnBoarding: undefined
}

export type MainTabParamList = {
  Map: undefined
  Search: undefined
  Record: undefined
  MyPage: undefined
}

export type MapStackParamList = {
  MapHome: undefined
  MapRecommend: undefined
}

export type RecordStackParamList = {
  RecordMain: undefined
  CreateRecord: undefined
  ReadRecord: { id: number }
  EditRecord: { id: number }
}

export type MyPageStackParamList = {
  MyPageProfile: undefined
  MyPageSettings: undefined
  BookMarkList: undefined
  Test: undefined
  Test1: undefined
}

export type SearchStackParamList = {
  Search: { keyword: string; selected: string }
  Detail: { id: number }
}

export type RootScreenProps<S extends keyof RootStackParamList = keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, S>
