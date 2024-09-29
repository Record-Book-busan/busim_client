import { useMutation, useQueryClient } from '@tanstack/react-query'

import { post_check_nickname, post_nickname } from '@/services/user'
import { showToast } from '@/utils/toast'

export const useNickNameUpdate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (param: string) => {
      const isDup = await post_check_nickname({
        nickName: param,
      })

      if (isDup) {
        throw new Error('DUPLICATE!')
      }

      await post_nickname({ nickName: param })
    },
    onError: err => {
      if (err.message === 'DUPLICATE!') {
        showToast({ text: '이미 사용 중인 닉네임입니다.' })
      } else {
        showToast({ text: '닉네임 업데이트가 실패했어요' })
      }
      console.error('[ERROR] 닉네임 업데이트 실패:', err)
    },
    onSuccess: () => {
      showToast({ text: '닉네임을 변경했어요.' })
      queryClient.invalidateQueries({ queryKey: ['userInfo'] })
    },
  })
}
