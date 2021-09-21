const crypto = require('crypto')
const tokenService = require('./tokens')
const db = require('../database/database')
const moment = require('moment')

// TODO replace moment by something better

let options = {}
options.saltlen = options.saltlen || 32
options.iterations = options.iterations || 25000
options.keylen = options.keylen || 512
options.encoding = options.encoding || 'hex'
options.digestAlgorithm = options.digestAlgorithm || 'sha256'

exports.setPassword = async (user) => {
  return new Promise((resolve, reject) => {
    if (!user.password) {
      return reject(new Error('No password was given'))
    }

    // Password need to be at least 5 long and no longer than 20
    if (user.password && (user.password.length < 4 || user.password.length >= 20)) {
      return reject(new Error('Password needs to be longer than 4 and shorter than 20'))
    }

    // Use legacy system for creating salt and hash
    user.salt = this.makeSalt()
    user.hash = crypto.createHmac('sha1', user.salt).update(user.password).digest('hex')
    delete user.password
    resolve(user)
  })
}



exports.login = async (name, pw) => {
  const user = await db.getUserByEmail(name)
  if (!user) return { message: 'not found' }

  const pwResult = await this.encryptPassword(pw, user.salt, user.hash)
  if (pwResult === 'ok') {
    user.token = tokenService.createToken(user.role, user.email, user._id)
    user.expiry = moment().add(12, 'hours').valueOf()
    return user
  } else {
    return pwResult
  }
}

module.exports.encryptPassword = async (password, salt, hash) => {
  const calculatedHash = crypto.createHmac('sha1', salt).update(password).digest('hex')
  if (calculatedHash === hash) {
    return 'ok'
  } else {
    return new Error('wrong password')
  }
}

module.exports.makeSalt = () => {
  return crypto
    .randomBytes(Math.ceil(options.saltlen / 2))
    .toString('hex')
    .substring(0, options.saltlen)
}

