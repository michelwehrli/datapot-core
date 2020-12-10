interface IRestError {
  success: boolean
  authorized: boolean
  errorCode: number
  errorMessage: string
  stack?: string
}
