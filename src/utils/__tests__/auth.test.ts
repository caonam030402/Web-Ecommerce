import { describe, it, expect } from 'vitest'
import {
  clearLS,
  getAccessTokenFromLS,
  getProfileFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setProfileToLS,
  setRefreshTokenToLS
} from '../auth'

const access_token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGJlOTRhN2I4ZDNiMGYzYzFiN2IyMzkiLCJpYXQiOjE2OTAyMTQ4NTAsImV4cCI6MTY5MDI1MDg1MH0.Kmg39Rl7fPULQLogIXBZ2lFYepJ1_SYKLCMg1Pva51Y'
const refresh_token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGJlOTRhN2I4ZDNiMGYzYzFiN2IyMzkiLCJpYXQiOjE2OTAyMTQ4NTAsImV4cCI6MTY5MDI1MDg1MH0.QRHyyMFUFPDLMmH6zw7619qQzbu3ad3IEoPAfSFwi7w'
const profile =
  '{"_id":"64be94a7b8d3b0f3c1b7b239","email":"namcaokk1000009990@gmail.com","roles":[],"createdAt":"2023-07-24T15:11:35.192Z","updatedAt":"2023-07-24T15:11:35.192Z","__v":0}'

describe('setAccessTokenToLS', () => {
  it('setAccessTokenToLS', () => {
    setAccessTokenToLS(access_token)
    expect(localStorage.getItem('access_token')).toBe(access_token)
  })
})

describe('setRefreshTokenToLS', () => {
  it('setRefreshTokenToLS', () => {
    setRefreshTokenToLS(refresh_token)
    expect(localStorage.getItem('refresh_token')).toEqual(refresh_token)
  })
})

describe('getRefreshTokenFromLS', () => {
  it('getRefreshTokenFromLS', () => {
    setRefreshTokenToLS(refresh_token)
    expect(localStorage.getItem('refresh_token')).toBe(refresh_token)
  })
})

describe('clearLS', () => {
  it('clearLS', () => {
    setRefreshTokenToLS(refresh_token)
    setAccessTokenToLS(access_token)
    clearLS()
    expect(getAccessTokenFromLS()).toBe('')
    expect(getRefreshTokenFromLS()).toBe('')
  })
})

describe('getProfileFromLS', () => {
  it('getProfileFromLS', () => {
    setProfileToLS(JSON.parse(profile))
    expect(getProfileFromLS()).toEqual(JSON.parse(profile))
  })
})
