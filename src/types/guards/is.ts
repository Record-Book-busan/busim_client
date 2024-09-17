import { SearchDetail, SearchDetailRestaurant, SearchTourist } from '../schemas/place'

export function isTourist(detail: SearchDetail): detail is SearchTourist {
  return detail.cat1 === 'tourist'
}

export function isRestaurant(detail: SearchDetail): detail is SearchDetailRestaurant {
  return detail.cat1 === 'restaurant'
}
