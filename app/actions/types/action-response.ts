type Error = {
  title: string
  message: string
  code?: string
  statusCode?: number
}

export type SuccessResponse<T> = {
  status: 'success'
  data: T
}

export type ErrorResponse = {
  status: 'error'
  errors: Error[]
}

export type ActionResponse<T> = Promise<SuccessResponse<T> | ErrorResponse>

