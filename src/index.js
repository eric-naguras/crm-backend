const ABILITIES = require('./helpers/abilities')
const tokenService = require('./helpers/tokens')
const db = require('./database/database')
const express = require('express')
const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(function (req, res, next) {
  res.setHeader('X-Powered-By', 'CERN httpd')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Vary', 'Origin')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.setHeader('Access-Control-Expose-Headers', 'Authorization, X-Served-By')
  next()
})


// Protect routes by checking token
app.use((req, res, next) => {
  if (req.method !== 'OPTIONS') {
    if (req.path.startsWith('/api/', 0)) {
      if (req.headers.authorization) {
        const result = tokenService.checkToken(req.headers.authorization)
        if (result.error) {
          return res.status(401).send(result.error)
        } else {
          const tmp = result.payload.data.split(',')
          req.role = tmp[1].trim()
          // req.role = 'marketingAssistant'
          req.username = tmp[2].trim()
          req.ability = ABILITIES[req.role]
          req.id = tmp[3].trim()
          db.logRequest({ date: new Date(), url: req.url, host: req.hostname, ip: req.ip })
          next()
        }
      } else {
        res.status(401).send('Unauthorized')
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

// ACL rules, if no ability to read, just return an empty array
// Every route should be checked and routes should be present in abilities.js
// Additional rules like delete are in the router code
app.use((req, res, next) => {
  if (req.method !== 'OPTIONS') {
    if (req.path.startsWith('/api/', 0)) {
      // console.log('Checking access for', req.path)
      if (req.path.startsWith('/api/contacts')) {
        if (!req.ability.can('read', 'contacts')) {
          return res.status(401).send([])
        }
      }
      if (req.path.startsWith('/api/calls')) {
        if (!req.ability.can('read', 'calls')) {
          return res.status(401).send([])
        }
      }
      if (req.path.startsWith('/api/bookings')) {
        if (!req.ability.can('read', 'bookings')) {
          return res.status(401).send([])
        }
      }
      next()
    } else {
      next()
    }
  } else {
    next()
  }
})

app.use('/api', require('./routes/protected'))
app.use('/', require('./routes/unprotected'))

// If no route is matched by now, it must be a 404
app.use(function (req, res) {
  return res.status(404).send()
})

const init = async () => {
  try {
    const dbinit = await db.init()
    if (dbinit) {
      console.log('DB initialized')
      app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
      })
    } else {
      throw new Error('Could not connect to database')
    }
  } catch (ex) {
    console.error(`Error: ${ex.message || ex}`)
  }
}

init()
