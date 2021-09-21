const express = require('express')
const router = express.Router()
const handler = require('./routesHandler')

// #region *************** Contacts ***************

router.get('/contacts', async (req, res) => {
  if (req.ability.can('read', 'contacts')) {
    const contacts = await handler.getContacts()
    return res.status(200).send(contacts)
  }
  return res.status(403).send('Not allowed to read contacts')
})

router.get('/contacts/:type', async (req, res) => {
  if (req.ability.can('read', 'contacts')) {
    const contacts = await handler.getContacts(req.params.type)
    return res.status(200).send(contacts)
  }
  return res.status(403).send('Not allowed to read contacts')
})

// #endregion *************** Contacts ***************


// region *************** Calls ***************

router.get('/calls', async (req, res) => {
  if (req.ability.can('read', 'calls')) {
    const contacts = await handler.getCallsById()
    return res.status(200).send(contacts)
  }
  return res.status(403).send('Not allowed to read calls')
})

router.get('/calls/:id', async (req, res) => {
  if (req.ability.can('read', 'calls')) {
    const contacts = await handler.getCallsById(req.params.id)
    return res.status(200).send(contacts)
  }
  return res.status(403).send('Not allowed to read calls')
})

router.post('/calls', async (req, res) => {
  if (req.ability.can('create', 'calls')) {
    const result = await handler.createCall(req.body.call)
    return res.status(200).send(result)
  }
  return res.status(403).send('Not allowed to create calls')
})

// #endregion *************** Calls ***************


// #region *************** Bookings ***************

router.get('/bookings', async (req, res) => {
  if (req.ability.can('read', 'bookings')) {
    const bookings = await handler.getBookingsById(null, 'booking')
    return res.status(200).send(bookings)
  }
  return res.status(403).send('Not allowed to read bookings')
})

router.get('/proposals', async (req, res) => {
  if (req.ability.can('read', 'bookings')) {
    const bookings = await handler.getBookingsById(null, 'proposal')
    return res.status(200).send(bookings)
  }
  return res.status(403).send('Not allowed to read bookings')
})

router.get('/bookings/:id', async (req, res) => {
  if (req.ability.can('read', 'bookings')) {
    const bookings = await handler.getBookingsById(req.params.id, 'booking')
    return res.status(200).send(bookings)
  }
  return res.status(403).send('Not allowed to read bookings')
})

router.get('/proposals/:id', async (req, res) => {
  if (req.ability.can('read', 'bookings')) {
    const proposals = await handler.getBookingsById(req.params.id, 'proposal')
    return res.status(200).send(proposals)
  }
  return res.status(403).send('Not allowed to read bookings')
})

router.post('/bookings', async (req, res) => {
  if (req.ability.can('create', 'bookings')) {
    const result = await handler.createBooking(req.body.booking)
    return res.status(200).send(result)
  }
  return res.status(403).send('Not allowed to create booking')
})

// #endregion *************** Bookings ***************

router.post('/users', async (req, res) => {
  if (req.ability.can('create', 'users')) {
    const result = await handler.saveOrUpdateUser(req.body.user)
    return res.status(200).send(result)
  }
  return res.status(403).send('Not allowed to create user')
})

module.exports = router
