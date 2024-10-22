const express = require('express');
const router = express.Router();
const rollCallController = require('../../controllers/rollCallController');

// 建立點名表
router.post('/',rollCallController.createRollCall);
// 分頁查詢 RollCall 資料
router.get('/pagination',rollCallController.getPaginatedRollCall);
// 搜尋功能
router.get('/search', rollCallController.searchRollCallMembers);
// 更新簽到狀態
router.put('/update-check/:id', rollCallController.updateCheckStatus)

module.exports = router;
