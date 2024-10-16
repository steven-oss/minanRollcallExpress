const express = require('express')
const router = express.Router()

const gender = require('./modules/gender')

router.use('/minaanrollcall',gender)

module.exports = router
