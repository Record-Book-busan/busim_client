import { CategoryType } from '@/constants'

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
  Map: NavigatorScreenParams<MapStackParamList>
  Search: undefined
  Record: undefined
  MyPage: undefined
}

export type MapStackParamList = {
  MapHome: { categories: CategoryType[] }
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
  RecordList: undefined
  Test: undefined
}

export type SearchStackParamList = {
  Search: undefined
  Detail: { id: number }
}

export type RootScreenProps<S extends keyof RootStackParamList = keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, S>
