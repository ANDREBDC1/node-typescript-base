class Error {
  constructor (message: string, statusCode = 400) {
    this.message = message
    this.statusCode = statusCode
  }

  public readonly message: string
  public readonly statusCode: number
}

export default Error
