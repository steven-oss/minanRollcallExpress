const express = require('express')
const router = express.Router()
const { gender } = require('../../models/miaanRollCall')

router.get('/', async (req, res) => {
    try {
        const genderList = await gender.findAll({ raw: true })
        console.log(genderList)
        res.json({
            message:'ok',
            data:genderList
        })
    } catch (error) {
        console.error('連接數據庫時出現錯誤：', error)
        res.status(500).send('Server Error')
    }
})

module.exports = router
