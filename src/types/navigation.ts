import type { PlaceType } from '@/services/place'
import type { NavigatorScreenParams } from '@react-navigation/native'
import type { StackScreenProps } from '@react-navigation/stack'

export type RootStackParamList = {
  Login: undefined
  Authenticated: NavigatorScreenParams<AuthStackParamList>
  Error: undefined
}

export type AuthStackParamList = {
  MainTab: NavigatorScreenParams<MainTabParamList>
  MapStack: NavigatorScreenParams<MapStackParamList>
  SearchStack: NavigatorScreenParams<SearchStackParamList>
  Login: undefined
  PrivacyPolicy: undefined
  OnBoardingStack: NavigatorScreenParams<OnboardingStackParamList>
  CreateRecordStack: NavigatorScreenParams<CreateRecordStackParamList>
  MyPageStack: NavigatorScreenParams<MyPageStackParamList>
}

export type OnboardingStackParamList = {
  OnBoarding: undefined
}

export type MainTabParamList = {
  Map: undefined
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
  RecordMain: { tab?: number }
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
  FindWay: undefined
}

export type RootScreenProps<S extends keyof AuthStackParamList = keyof AuthStackParamList> =
  StackScreenProps<AuthStackParamList, S>

export type AuthenticatedScreenProps<
  S extends keyof AuthStackParamList = keyof AuthStackParamList,
> = StackScreenProps<AuthStackParamList, S>
