const express = require('express')
const router = express.Router()

const gender = require('./modules/gender')
const member = require('./modules/member')

router.use('/gender',gender)
router.use('/members',member)

module.exports = router
