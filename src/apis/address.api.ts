import { Address } from 'src/types/address.type'
import { SuccessResponse } from 'src/types/utils.type'
import { http } from 'src/utils/http'

export const addressApi = {
  getAddress() {
    return http.get<SuccessResponse<Address[]>>('/address')
  }
}
