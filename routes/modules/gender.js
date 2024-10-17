const express = require('express')
const router = express.Router()
const genderController = require('../../controllers/genderController')

router.get('/',genderController.getGenders);

module.exports = router
