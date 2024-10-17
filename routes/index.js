const express = require('express')
const router = express.Router()

const gender = require('./modules/gender')
const member = require('./modules/member')
const rollCall = require('./modules/rollCall')

router.use('/gender',gender)
router.use('/members',member)
router.use('/roll-call',rollCall)

module.exports = router
