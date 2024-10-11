import React, { createContext, useContext, useReducer, useEffect } from 'react'

import { storage } from '@/App'
import { delete_user_membership, handleSignIn, logoutAll, type Role } from '@/services/auth'

/**
 * 현재 인증 상태를 나타내는 객체
 */
type AuthState = {
  /** 스토리지에서 값을 가져올 때 로딩상태 */
  isLoading: boolean
  /** 로그아웃 상태 */
  isSignOut: boolean
  /** 권한 */
  role: Role | null
  /** 토큰 */
  token: string | null
}

type AuthAction =
  | { type: 'RESTORE_TOKEN'; token: string | null; role: Role | null }
  | { type: 'SIGN_IN'; token: string; role: Role }
  | { type: 'SIGN_OUT' }

type AuthContextType = {
  state: AuthState
  signIn: (provider: 'kakao' | 'apple' | 'guest' | 'share') => Promise<Role | undefined>
  signOut: () => Promise<void>
  unRegister: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * 인증 상태를 업데이트하는 함수
 */
const authReducer = (prevState: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    /** 앱 시작 시 저장된 토큰을 복원 */
    case 'RESTORE_TOKEN':
      return {
        ...prevState,
        token: action.token,
        role: action.role,
        isLoading: false,
      }
    /** 로그인 시 새 토큰 설정 */
    case 'SIGN_IN':
      return {
        ...prevState,
        isSignOut: false,
        token: action.token,
        role: action.role,
      }
    /** 로그아웃 시 토큰 제거 */
    case 'SIGN_OUT':
      return {
        ...prevState,
        isSignOut: true,
        token: null,
        role: null,
      }
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isLoading: true,
    isSignOut: false,
    token: null,
    role: null,
  })

  useEffect(() => {
    const bootstrapAsync = () => {
      let role, token
      try {
        role = storage.getString('role') as Role
        token = storage.getString('accessToken')
      } catch (err) {
        console.log('[ERROR] 토큰 복원 실패:', err)
      }
      dispatch({ type: 'RESTORE_TOKEN', role: role ?? null, token: token ?? null })
    }

    bootstrapAsync()
  }, [])

  const authContext = React.useMemo(
    () => ({
      signIn: async (provider: 'kakao' | 'apple' | 'guest' | 'share') => {
        try {
          const { role, token } = await handleSignIn(provider)
          storage.set('role', role)
          dispatch({ type: 'SIGN_IN', role, token })
          return role
        } catch (error) {
          console.error('로그인 failed:', error)
        }
      },
      signOut: async () => {
        try {
          await logoutAll()
          storage.delete('role')
          dispatch({ type: 'SIGN_OUT' })
        } catch (error) {
          console.error('로그아웃 failed:', error)
        }
      },
      unRegister: async () => {
        try {
          await delete_user_membership()
          await logoutAll()
          storage.delete('role')
          dispatch({ type: 'SIGN_OUT' })
        } catch (error) {
          console.error('회원탈퇴 failed:', error)
          throw error
        }
      },
      state,
    }),
    [state],
  )

  return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('[ERROR] context 초기화 에러')
  }
  return context
}
