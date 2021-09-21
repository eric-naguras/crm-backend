const { defineAbility } = require('@casl/ability')

const admin = defineAbility((can) => {
  can('view', 'all')
  can('create', 'all')
  can('read', 'all')
  can('update', 'all')
  can('delete', 'all')
  can('upload', 'all')
})

const agent = defineAbility((can) => {
  can('create', ['contacts', 'calls', 'bookings'])
  can('read', ['contacts', 'calls', 'bookings'])
  can('update', ['contacts'])
  can('delete', 'nothing')
  can('upload', 'nothing')
})

module.exports = { admin, agent }
