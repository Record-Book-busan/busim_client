import { LocationToAddr } from '@/services/record'

/**
 * 지역명, 상세 주소, 산 여부 등을 고려하여 전체 주소를 포맷팅합니다.
 */
export const formatAddress = (data?: LocationToAddr) => {
  if (!data || data.documents.length === 0) {
    return { fullAddress: '주소 정보가 없습니다.', zipCode: '' }
  }

  const doc = data.documents[0]
  const address = doc.address
  const roadAddress = doc.road_address

  const fullAddress = `${address.region_1depth_name} ${address.region_2depth_name} ${address.region_3depth_name}`

  let detailAddress = ''
  if (address.mountain_yn === 'Y') {
    detailAddress = `산 ${address.main_address_no}`
    if (address.sub_address_no) {
      detailAddress += `-${address.sub_address_no}`
    }
  } else {
    detailAddress = `${address.main_address_no}`
    if (address.sub_address_no) {
      detailAddress += `-${address.sub_address_no}`
    }
  }

  const zipCode = address.zip_code || roadAddress?.zone_no || ''

  return {
    fullAddress: `${fullAddress} ${detailAddress}`,
    zipCode: zipCode || '우편 번호가 없습니다.',
  }
}
