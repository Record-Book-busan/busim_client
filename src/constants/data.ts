export const CATEGORY = {
  관광지: 'TOURIST_SPOT',
  자연: 'NATURE',
  테마: 'THEME',
  레포츠: 'LEISURE_SPORTS',
  핫플: 'HOT_PLACE',
  맛집: 'NORMAL_RESTAURANT',
  특별한_맛집: 'SPECIAL_RESTAURANT',
  기록: 'RECORD',
} as const
export type CategoryKey = keyof typeof CATEGORY
export type CategoryType = (typeof CATEGORY)[keyof typeof CATEGORY]

export const getCategoryText = (categoryId: CategoryType) => {
  const entry = Object.entries(CATEGORY).find(([_, value]) => value === categoryId)
  return entry ? (entry[0] as CategoryKey) : '정보 없음'
}
