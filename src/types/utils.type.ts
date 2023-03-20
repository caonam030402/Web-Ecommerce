//interface for getting responses from the API.
export interface SuccessResponse<Data> {
  message: string
  data: Data
}

export interface ErrorResponse<Data> {
  message: string
  data?: Data
}

export type NoUndefineField<T> = {
  [P in keyof T]-?: NoUndefineField<NonNullable<T[P]>>
}
