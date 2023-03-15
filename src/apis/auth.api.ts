import { AuthResponse } from './../types/auth.type'
import { http } from 'src/utils/http'
import { path } from 'src/constants/path'

export const authApi = {
  registerAccount(body: { email: string; password: string }) {
    return http.post<AuthResponse>(path.register, body)
  },
  login(body: { email: string; password: string }) {
    return http.post<AuthResponse>(path.login, body)
  },
  logout() {
    return http.post(path.logout)
  }
}
