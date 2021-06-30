const resFormat = {
  return(msg, errCode) {
    if (!errCode) {
      return {
        status: true,
        code: 200,
        data: msg || '200'
      }
    }
    return {
      status: false,
      message: msg || '200',
      code: errCode,
      data: {}
    }
  }
}

module.exports = resFormat
