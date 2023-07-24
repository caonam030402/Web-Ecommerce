import { Product } from './product.type'

export interface Promotion {
  _id: string
  promotion_quanlity: number
  product: Product
  price: string
  time_slot: TimeSlot
}

export interface TimeSlot {
  _id: string
  time_start: Date
  time_end: Date
}
