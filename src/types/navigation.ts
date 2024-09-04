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
  RecordDetail: { id: number }
  CreateRecord: undefined
}

export type MyPageStackParamList = {
  MyPageProfile: undefined
  MyPageSettings: undefined
  Test: undefined
  Test1: undefined
}

type SearchProps = {
  keyword: string
  selected: string
}

type DetailProps = {
  id: string
}

export type SearchStackParamList = {
  Search: SearchProps
  Detail: DetailProps
}

export type RootScreenProps<S extends keyof RootStackParamList = keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, S>
