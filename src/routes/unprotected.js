const express = require('express')
const router = express.Router()
const handler = require('./routesHandler')


// #region *************** Users ***************

router.post('/login', async (req, res) => {
  if (req.body.email && req.body.password) {
    const result = await handler.checkLogin(req.body.email, req.body.password)
    // result.result.role = 'marketingAssistant'
    return res.status(result.status).send(result.result)
  } else {
    return res.status(400).send('Incomplete login data')
  }
})

router.post('/users/', async (req, res) => {
  const user = await handler.saveOrUpdateUser(req.body.user)
  return res.status(user.status).send(user.result)
})

// #endregion *************** Users ***************



// Temp functions for seeding database
router.get('/seedcontacts', async (req, res) => {
  await handler.seedContacts()
  return res.status(200).send('ok')
})


module.exports = router
