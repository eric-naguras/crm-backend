const db = require('../database/database')
const auth = require('../helpers/auth')


// #region *************** Users ***************

exports.checkLogin = async (username, password) => {
  try {
    const result = await auth.login(username, password)
    if (result.message === 'not found') {
      return { status: 401, result: 'Wrong password or user name' }
    }
    const loginResult = {
      expiry: result.expiry,
      email: result.email,
      firstName: result.firstName,
      lastName: result.lastName,
      token: result.token,
      role: result.role,
      _id: result._id
    }
    return { status: 200, result: loginResult }
  } catch (ex) {
    ex.status = 500
    return checkErrors(ex)
  }
}

exports.saveOrUpdateUser = async (user) => {
  try {
    const result = await db.saveOrUpdateUser(user)
    if (result instanceof Error) {
      result.status = 404
      return checkErrors(result)
    }
    return { status: 200, result: result }
  } catch (ex) {
    return checkErrors(ex)
  }
}

// #endregion *************** Users ***************

// #region *************** Contacts ***************

exports.getContacts = async (type) => {
  try {
    const result = await db.getContacts(type)
    if (result instanceof Error) {
      result.status = 404
      return checkErrors(result)
    }
    return { status: 200, result: result }
  } catch (ex) {
    return checkErrors(ex)
  }
}


// #endregion *************** Contacts ***************

// #endregion *************** Calls ***************

exports.getCallsById = async (id) => {
  try {
    const result = await db.getCalls(id)
    if (result instanceof Error) {
      result.status = 404
      return checkErrors(result)
    }
    return { status: 200, result: result }
  } catch (ex) {
    return checkErrors(ex)
  }
}
exports.createCall = async (call) => {
  try {
    const result = await db.saveCall(call)
    if (result instanceof Error) {
      result.status = 404
      return checkErrors(result)
    }
    return { status: 200, result: result }
  } catch (ex) {
    return checkErrors(ex)
  }
}

// #endregion *************** Calls ***************

// #region *************** Bookings ***************

exports.createBooking = async (booking) => {
  try {
    const result = await db.saveBooking(booking)
    if (result instanceof Error) {
      result.status = 404
      return checkErrors(result)
    }
    return { status: 200, result: result }
  } catch (ex) {
    return checkErrors(ex)
  }
}

exports.getBookingsById = async (id, type) => {
   try {
     const result = await db.getBookings(id, type)
     if (result instanceof Error) {
       result.status = 404
       return checkErrors(result)
     }
     return { status: 200, result: result }
   } catch (ex) {
     return checkErrors(ex)
   }
}

// #endregion *************** Bookings ***************

// #region *************** Helper Methods ***************


const checkErrors = (results) => {
  // Set default error status
  if (!results.status) {
    results.status = 500
  }
  if (results instanceof Error) {
    return { status: results.status, result: results.message }
  } else {
    return { status: 200, result: results }
  }
}

// #endregion *************** Helper Methods ***************



// Temp functions for seeding database
exports.seedContacts = async () => {
  return await db.seedContacts()
}

