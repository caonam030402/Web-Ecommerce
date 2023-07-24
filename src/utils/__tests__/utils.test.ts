import { AxiosError, isAxiosError } from 'axios'
import { describe, it, expect } from 'vitest'
import { isAxiosUnauthorizedError, isAxiosUnprocessableEntityError } from '../auth'
import { HttpStatusCode } from 'src/constants/httpStatusCode'

describe('isAxiosError', () => {
  // Dùng để ghi trú trường hợp cần test
  it('isAxiosError return boolean', () => {
    expect(isAxiosError(new Error())).toBe(false)
    expect(isAxiosError(new AxiosError())).toBe(true)
  })
})

describe('isAxiosUnprocessableEntityError', () => {
  it('isAxiosUnprocessableEntityError return boolean', () => {
    expect(isAxiosUnprocessableEntityError(new Error())).toBe(false)
    expect(
      isAxiosUnprocessableEntityError(
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: HttpStatusCode.InternalServerError
        } as any)
      )
    ).toBe(false)
    expect(
      isAxiosUnprocessableEntityError(
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: HttpStatusCode.UnprocessableEntity
        } as any)
      )
    ).toBe(true)
  })
})

describe('isAxiosUnauthorizedError', () => {
  it('isAxiosUnauthorizedError return bolean', () => {
    expect(isAxiosUnauthorizedError(new Error())).toBe(false)
    expect(
      isAxiosUnauthorizedError(
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: HttpStatusCode.InternalServerError
        } as any)
      )
    ).toBe(false)
    expect(
      isAxiosUnauthorizedError(
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: HttpStatusCode.Unauthorized
        } as any)
      )
    ).toBe(true)
  })
})
