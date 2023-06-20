import { AxiosError, HttpStatusCode, isAxiosError } from 'axios'
import { User } from 'src/types/user.type'
import { ErrorResponse } from 'src/types/utils.type'

export const localStorageEventTarget = new EventTarget()

export const setAccessTokenToLS = (access_token: string) => localStorage.setItem('access_token', access_token)
export const setRefreshTokenToLS = (refresh_token: string) => localStorage.setItem('refresh_token', refresh_token)

export const clearLS = () => {
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
  const clearLSEevent = new Event('clearLS')
  localStorageEventTarget.dispatchEvent(clearLSEevent)
}

export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || ''
export const getRefreshTokenFromLS = () => localStorage.getItem('refresh_token') || ''

export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export function isAxiosUnauthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}

export function isAxiosExpiredTokenError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return (
    isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error) &&
    error.response?.data.message === 'Token không được ủy quyền đã hết hạn, vui lòng đăng nhập lại'
  )
}

export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const setProfileToLS = (profile: User) => localStorage.setItem('profile', JSON.stringify(profile))
