const express = require('express');
const router = express.Router();
const rollCallController = require('../../controllers/rollCallController');

// 建立點名表
router.post('/',rollCallController.createRollCall);
// 分頁查詢 RollCall 資料
router.get('/pagination',rollCallController.getPaginatedRollCall);

module.exports = router;
