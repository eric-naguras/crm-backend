const jwt = require('jsonwebtoken')
const jwtSecret = 'dgsrtehyjrty6agfr45g56yh'

exports.createToken = function (role, username, id) {
  return jwt.sign(
    {
      data: `crm,${role},${username},${id}`
    },
    jwtSecret,
    { expiresIn: '12h' }
  )
  // }, jwtSecret, {expiresIn: '12h'})
}

// Used in Admin app
exports.checkToken = function (token) {
  const tkn = token
  try {
    const decoded = jwt.verify(tkn, jwtSecret)
    return { payload: decoded, error: null }
  } catch (ex) {
    return { payload: null, error: ex.message }
  }
}
