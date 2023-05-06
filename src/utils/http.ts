import { clearLS, getAccessTokenFromLS, setAccessTokenToLS, setProfileToLS } from './auth'
import { AuthResponse } from './../types/auth.type'
import { HttpStatusCode } from './../constants/httpStatusCode'
import axios, { type AxiosInstance } from 'axios'
import { toast } from 'react-toastify'

enum URL {
  login = '/login',
  register = '/resgister',
  logout = '/logout'
}

class Http {
  instance: AxiosInstance
  private accessToken: string
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = this.accessToken
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    //Error handling in addition to error 422
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === URL.login || url === URL.register) {
          const data = response.data as AuthResponse
          this.accessToken = data.data.access_token
          setAccessTokenToLS(this.accessToken)
          setProfileToLS(data.data.user)
        } else if (url === URL.logout) {
          this.accessToken = ''
          clearLS()
        }
        return response
      },
      function (error) {
        if (error.response.status !== HttpStatusCode.UnprocessableEntity) {
          const data: any | undefined = error.response?.data
          const message = data.message || error.message
          toast.error(message)
        }
        if (error.response.status === HttpStatusCode.Unauthorized) {
          clearLS()
        }
        return Promise.reject(error)
      }
    )
  }
}

export const http = new Http().instance
