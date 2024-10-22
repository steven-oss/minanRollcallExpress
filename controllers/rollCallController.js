const rollCallService= require('../services/rollCallService')
const { check, validationResult } = require('express-validator');


// 建立表單
exports.createRollCall = async (req, res) => {
    const { date } = req.body; // 假設前端傳遞日期，應為 YYYY-MM-DD 格式

    try {
        await rollCallService.createRollCall(date);
        res.status(201).json({ message: 'Roll call created successfully.' });
    } catch (error) {
        console.error(error);
        if (error.message.includes('has already been added')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error creating roll call.', error });
    }
};

// 分頁顯示點名表
exports.getPaginatedRollCall = async (req, res) => {
    const {date} = req.query;

    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        if(!date){
            return res.status(400).json({ message: 'Date parameter is required.' });
        }
        const paginatedData = await rollCallService.getPaginatedRollCall(date,page, pageSize);
        res.json({ message: 'successful', data: paginatedData.rollCallList, pagination: paginatedData.pagination });
    } catch (error) {
        console.error('連接數據庫時出現錯誤：', error);
        res.status(500).send('Server Error');
    }
};

// 搜尋成員
exports.searchRollCallMembers = async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) {
            return res.status(400).json({ error: 'username query parameter is required' });
        }
        const members = await rollCallService.searchRollCallMemberByUsername(username);
        res.json({ message: 'successful', data: members });
    } catch (error) {
        if (error.message === 'No members found') {
            return res.status(404).json({ message: error.message });
        }
        console.error('連接數據庫時出現錯誤：', error);
        res.status(500).send('Server Error');
    }
};

exports.updateCheckStatus = [
    check('check').isBoolean().withMessage('Check must be a boolean value'),

    async (req,res)=>{
        const errors = validationResult(req);

    // 如果有驗證錯誤，返回 400 錯誤
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id } = req.params;
        const { check } = req.body;

        // 調用 service 層更新 check 欄位
        const updatedRecord = await rollCallService.updateCheckStatus(id, check);

        res.json({ message: 'Check status updated successfully', updatedRecord });
    } catch (error) {
        console.error('Error updating check status:', error);
        res.status(500).json({ message: error.message });
    }
    }
]
