export const CATEGORY = {
  관광지: 1,
  자연: 8,
  테마: 2,
  레포츠: 16,
  핫플: 4,
  맛집: 32,
  카페: 64,
} as const
export type CategoryKey = keyof typeof CATEGORY
export type CategoryType = (typeof CATEGORY)[keyof typeof CATEGORY]
