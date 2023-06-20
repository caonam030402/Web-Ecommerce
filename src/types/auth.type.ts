import { User } from './user.type'
import { SuccessResponse } from './utils.type'

// Use type Auth to make it easier to access or alter the contents
export type AuthResponse = SuccessResponse<{
  access_token: string
  refresh_token: string
  expires_refresh_token: number
  expires: number
  user: User
}>

export type RefreshTokenReponse = SuccessResponse<{ access_token: string }>
