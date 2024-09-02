import type { NavigatorScreenParams } from '@react-navigation/native'
import type { StackScreenProps } from '@react-navigation/stack'

export type RootStackParamList = {
  Login: undefined
  PrivacyPolicy: undefined
  InterestStack: NavigatorScreenParams<InterestStackParamList>
  MainTab: NavigatorScreenParams<MainTabParamList>
  RecordStack: NavigatorScreenParams<RecordStackParamList>
  MyPageStack: NavigatorScreenParams<MyPageStackParamList>
}

type InterestFoodProps = {
  title: string
  isSelected: boolean
}

export type InterestStackParamList = {
  InterestTour: undefined
  InterestFood: InterestFoodProps[]
}

export type MainTabParamList = {
  Map: undefined
  Record: undefined
  MyPage: undefined
}

export type MapStackParamList = {
  MapHome: undefined
  MapRecommend: undefined
}

export type RecordStackParamList = {
  RecordMain: undefined
  RecordDetail: undefined
  CreateRecord: undefined
}

export type MyPageStackParamList = {
  MyPageProfile: undefined
  MyPageSettings: undefined
}

export type RootScreenProps<S extends keyof RootStackParamList = keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, S>
