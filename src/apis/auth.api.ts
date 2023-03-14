import { AuthResponse } from './../types/auth.type'
import { http } from 'src/utils/http'
import { path } from 'src/constants/path'

export const registerAccount = (body: { email: string; password: string }) => {
  return http.post<AuthResponse>(path.register, body)
}

export const login = (body: { email: string; password: string }) => {
  return http.post<AuthResponse>(path.login, body)
}

export const logout = () => http.post(path.logout)
