//interface for getting responses from the API.
export interface SuccessResponse<Data> {
  message: string
  data?: Data
}
