const { check, validationResult } = require('express-validator');
const memberService = require('../services/memberService');

// 搜尋成員
exports.searchMembers = async (req, res) => {
    try {
        const { username } = req.query;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        if (!username) {
            return res.status(400).json({ error: 'username query parameter is required' });
        }

        const paginatedData = await memberService.searchMembersByUsername(username, page, pageSize);

        res.json({ 
            message: 'successful', 
            data: paginatedData.memberList, 
            pagination: paginatedData.pagination
        });
    } catch (error) {
        if (error.message === 'No members found') {
            return res.status(404).json({ message: error.message });
        }
        console.error('連接數據庫時出現錯誤：', error);
        res.status(500).send('Server Error');
    }
};


// 分頁顯示成員
exports.getPaginatedMembers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const paginatedData = await memberService.getPaginatedMembers(page, pageSize);
        res.json({ message: 'successful', data: paginatedData.memberList, pagination: paginatedData.pagination });
    } catch (error) {
        console.error('連接數據庫時出現錯誤：', error);
        res.status(500).send('Server Error');
    }
};

// 根據 ID 查找成員
exports.getMemberById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID is required' });
        }
        const member = await memberService.getMemberById(id);
        res.json({ message: 'successful', data: member });
    } catch (error) {
        if (error.message === 'No member found with the given id') {
            return res.status(404).json({ message: error.message });
        }
        console.error('連接數據庫時出現錯誤：', error);
        res.status(500).send('Server Error');
    }
};

// 創建新成員
exports.createMember = [
    // express-validator 驗證規則
    check('username').notEmpty().withMessage('Username is required').isLength({ min: 2 }).withMessage('Username must be at least 2 characters long'),
    check('phone').notEmpty().withMessage('Phone number is required').isMobilePhone().withMessage('Please provide a valid phone number'),
    check('gender').notEmpty().withMessage('Gender is required').isInt({ min: 1, max: 2 }).withMessage('Gender must be 1 (male) or 2 (female)'),
    check('isAdult').notEmpty().isBoolean().withMessage('isAdult must be a boolean value'),
    check('notes').optional().isString().withMessage('Notes must be a string'),
    check('street').optional().isString().withMessage('Street must be a string'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newMember = await memberService.createMember(req.body);
            res.status(201).json({ message: 'successful', member: newMember });
        } catch (error) {
            if (error.message === 'Phone number already exists. Please use a different phone.') {
                return res.status(400).json({ message: error.message });
            }
            console.error('連接數據庫時出現錯誤：', error);
            res.status(500).send('Server Error');
        }
    }
];

// 更新成員
exports.updateMember = [
    check('username').notEmpty().withMessage('Username is required').isLength({ min: 2 }).withMessage('Username must be at least 2 characters long'),
    check('phone').notEmpty().withMessage('Phone number is required').isMobilePhone().withMessage('Please provide a valid phone number'),
    check('gender').notEmpty().withMessage('Gender is required').isInt({ min: 1, max: 2 }).withMessage('Gender must be 1 (male) or 2 (female)'),
    check('isAdult').notEmpty().isBoolean().withMessage('isAdult must be a boolean value'),
    check('notes').optional().isString().withMessage('Notes must be a string'),
    check('street').optional().isString().withMessage('Street must be a string'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const updatedMember = await memberService.updateMemberAndRollCalls(req.params.id, req.body);
            res.json({ message: 'successful', data: updatedMember });
        } catch (error) {
            if (error.message === 'No member found with the given id' || "The phone number is already in use by another member.") {
                return res.status(404).json({ message: error.message });
            }
            console.error('連接數據庫時出現錯誤：', error);
            res.status(500).send('Server Error');
        }
    }
];
