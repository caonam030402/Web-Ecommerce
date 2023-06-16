import { SuccessResponse } from 'src/types/utils.type'
import { http } from 'src/utils/http'

interface BodyPayment {
  amount: number
  bankCode: string
  language: 'vn' | 'en'
}

export const vnpPaymentApi = {
  postPayment(body: BodyPayment) {
    return http.post<SuccessResponse<string>>('payment/create_payment_url', body)
  }
}
