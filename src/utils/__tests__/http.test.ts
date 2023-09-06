import { describe, it, expect } from 'vitest'
import { http } from '../http'
import { HttpStatusCode } from 'src/constants/httpStatusCode'
import { getAccessTokenFromLS } from '../auth'

describe('http axios', () => {
  it('Call API', async () => {
    const res = await http.get('products')
    expect(res.status).toBe(HttpStatusCode.Ok)
  })
  it('Auth Resquest', async () => {
    await http.post('login', {
      email: 'caonam811@gmail.com',
      password: 'caonam'
    })

    const res = await http.get('me')
    expect(res.status).toBe(HttpStatusCode.Ok)
  })
})
