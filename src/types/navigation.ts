import type { CategoryType } from '@/constants'
import type { PlaceType } from '@/services/place'
import type { NavigatorScreenParams } from '@react-navigation/native'
import type { StackScreenProps } from '@react-navigation/stack'

export type RootStackParamList = {
  Login: undefined
  PrivacyPolicy: undefined
  OnBoardingStack: NavigatorScreenParams<OnboardingStackParamList>
  MainTab: NavigatorScreenParams<MainTabParamList>
  MapStack: NavigatorScreenParams<MapStackParamList>
  CreateRecordStack: NavigatorScreenParams<CreateRecordStackParamList>
  MyPageStack: NavigatorScreenParams<MyPageStackParamList>
  SearchStack: NavigatorScreenParams<SearchStackParamList>
  Error: undefined
}

export type OnboardingStackParamList = {
  OnBoarding: undefined
}

export type MainTabParamList = {
  Map: { categories: CategoryType[] }
  Search: undefined
  Record: NavigatorScreenParams<RecordStackParamList>
  MyPage: undefined
}

export type MapStackParamList = {
  MapDetail: { id: number; type: PlaceType }
  MapRecommend: undefined
}

export type CreateRecordStackParamList = {
  CreateRecord: undefined
  EditRecord: { id: number }
}

export type RecordStackParamList = {
  RecordMain: undefined
  RecordSearch?: { query?: string }
  RecordResult: { query: string }
  ReadRecord: { id: number }
}

export type MyPageStackParamList = {
  MyPageSettings: undefined
  MyPageNickName: undefined
  BookMarkList: undefined
  RecordList: undefined
  Test: undefined
}

export type SearchStackParamList = {
  Search: undefined
  Detail: { id: number; type: string }
}

export type RootScreenProps<S extends keyof RootStackParamList = keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, S>
