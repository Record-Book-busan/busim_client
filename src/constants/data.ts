export const CATEGORY = {
  관광지: 64,
  자연: 8,
  테마: 16,
  레포츠: 4,
  핫플: 2,
  맛집: 1,
  특별한_맛집: 32,
} as const
export type CategoryKey = keyof typeof CATEGORY
export type CategoryType = (typeof CATEGORY)[keyof typeof CATEGORY]

export const getCategoryText = (categoryId: CategoryType) => {
  const entry = Object.entries(CATEGORY).find(([_, value]) => value === categoryId)
  return entry ? (entry[0] as CategoryKey) : '정보 없음'
}
