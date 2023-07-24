import { http } from 'src/utils/http'
import { SuccessResponse } from 'src/types/utils.type'
import { Promotion, TimeSlot } from 'src/types/promotion.type'

const URL = 'promotions'

export const promotionApi = {
  getTimeSlots() {
    return http.get<SuccessResponse<TimeSlot[]>>(`${URL}/time-slots`)
  },
  getPromotions(params: { promotionId: string }) {
    return http.get<SuccessResponse<Promotion[]>>(URL, { params })
  }
}
