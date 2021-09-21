const { MongoClient, ObjectId } = require('mongodb')
const auth = require('../helpers/auth')

const url = 'mongodb+srv://admin:Cire1234@cluster0.o1qod.mongodb.net/test'
let db = null

exports.init = () => {
  return new Promise((resolve, reject) => {
    try {
      MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
        if (err) {
          console.error(err)
          reject(err)
        } else {
          db = client.db(process.env.MONGO_DB || 'crm')
          resolve({ db })
        }
      })
    } catch (ex) {
      reject(ex.message)
    }
  })
}

// #region *************** Users ***************

exports.getUserByEmail = async (email) => {
  const result = await db.collection('auths').findOne({ email: email })
  if (result) {
    return result
  } else {
    console.error(`Warn: user ${email} not found`)
    return null
  }
}

exports.saveOrUpdateUser = async (user) => {
  removeSpaces(user)
  let pwChanged = false
  // Check if password has changed
  if (user.password) {
    pwChanged = true
    await auth.setPassword(user)
  }
  if (user._id) {
    // Get the user object
    const dbUser = await db.collection('auths').findOne({ _id: user._id })
    // Check if there is another user with the same email
    const checkEmailUser = await db.collection('auths').findOne({ email: user.email })
    if (checkEmailUser && checkEmailUser._id !== dbUser._id) {
      const err = new Error(`User ${user.email} is already in use by other user`)
      return err
    }
    dbUser.firstName = user.firstName
    dbUser.lastName = user.lastName
    dbUser.email = user.email
    dbUser.roles = user.roles
    if (pwChanged) {
      dbUser.local = user.local
    }
    const result = await db.collection('auths').replaceOne({ _id: user._id }, dbUser, { upsert: true })
    const savedUser = result.ops[0]
    delete savedUser.local
    delete savedUser.timestamps
    delete savedUser._m
    delete savedUser._type
    delete savedUser.id
    delete savedUser._v
    return savedUser
  } else {
    // Check if user doesn't exist already by email
    const userCheck = await db.collection('auths').findOne({ email: user.email })
    if (userCheck) {
      const err = new Error(`User ${user.email} already exists`)
      return err
    }
    user._id = new ObjectId().toString()
    await db.collection('auths').insertOne(user)
    delete user.hash
    delete user.salt
    return user
  }
}

// #endregion *************** Users ***************

// #region *************** Contacts ***************

exports.getContacts = async (type) => {
  if (type) {
    return await db.collection('contacts').find({ type }).toArray()
  } else {
    return await db.collection('contacts').find().toArray()
  }
}

// #endregion *************** Contacts ***************

// #endregion *************** Calls ***************

exports.getCalls = async (id) => {
 if (id) {
   return await db.collection('calls').find({ contactId: id }).sort({ callBack: 1}).toArray()
 } else {
   return await db.collection('calls').find().toArray()
 }
}

exports.saveCall = async (call) => {
  call._id = new ObjectId().toString()
  return await db.collection('calls').insertOne(call)
}

// #endregion *************** Calls ***************

// #region *************** Calls ***************
exports.saveBooking = async (booking) => {
  booking._id = new ObjectId().toString()
  return await db.collection('bookings').insertOne(booking)
}

exports.getBookings = async (id, type) => {
  if (id) {
    return await db.collection('bookings').find({ dealerId: id, type }).sort({ dateCreated: 1 }).toArray()
  } else {
    return await db.collection('bookings').find().toArray()
  }
}

// #endregion *************** Calls ***************

// #region *************** Helper Methods ***************

const removeSpaces = (item) => {
  for (const key in item) {
    if (typeof item[key] === 'string') {
      item[key] = item[key].trim()
    }
  }
}

// Temp functions for seeding database
exports.seedContacts = async () => {
  try {
    const c = require('./contacts')
    for await (const contact of c.loadedContacts) {
      contact._id = new ObjectId().toString()
      await db.collection('contacts').insertOne(contact)
    }
    return
  } catch (e) {
    console.error(e.message)
  }
}

exports.logRequest = async (logData) => {
  logData._id = new ObjectId().toString()
  await db.collection('logs').insertOne(logData)
}

// #endregion *************** Helper Methods ***************
