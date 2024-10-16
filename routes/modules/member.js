const express = require('express');
const router = express.Router();
const { member } = require('../../models/miaanRollCall');
const { check, validationResult } = require('express-validator');

//get /members
router.get('/',async(req,res)=>{
    try{
         // 从查询参数中获取分页的 page 和 pageSize，默认值为 page 1 和 pageSize 10
         const page = parseInt(req.query.page) || 1;
         const pageSize = parseInt(req.query.pageSize) || 10;
         console.log(`Requesting page: ${page}, pageSize: ${pageSize}`);

         // 使用 findAndCountAll 方法实现分页
        const { count: total, rows: memberList } = await member.findAndCountAll({
            offset: (page - 1) * pageSize, // 計算偏移量
            limit: pageSize, // 設置每頁的記錄數
        });

        console.log(`Retrieved ${memberList.length} members`);

        // 返回分页数据和总页数
        res.json({
            message: 'ok',
            data: memberList,
            pagination: {
                totalMembers: total,
                totalPages: Math.ceil(total / pageSize), // 計算總頁數
                currentPage: page,
                pageSize,
            },
        });
    }catch(error){
        console.error('連接數據庫時出現錯誤：', error)
        res.status(500).send('Server Error')
    }

})

// POST /members
router.post(
    '/',
    [
        // express-validator 验证规则
        check('username')
            .notEmpty()
            .withMessage('Username is required')
            .isLength({ min: 2 })
            .withMessage('Username must be at least 2 characters long'),
        check('phone')
            .notEmpty()
            .withMessage('Phone number is required')
            .isMobilePhone()
            .withMessage('Please provide a valid phone number'),
        check('gender')
            .notEmpty()
            .withMessage('Gender is required')
            .isInt({ min: 1, max: 2 })
            .withMessage('Gender must be 1 (male) or 2 (female)'),
        check('isAdult')
            .notEmpty()
            .isBoolean()
            .withMessage('isAdult must be a boolean value'),
        check('notes')
            .optional()
            .isString()
            .withMessage('Notes must be a string'),
        check('street')
            .optional()
            .isString()
            .withMessage('Street must be a string')
    ],
    async (req, res) => {
        // 检查验证结果
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const memberData = req.body;
        const { gender, isAdult, notes, phone, street, username } = memberData;

        try {
            // 检查是否已存在相同的电话号码
            const existingMember = await member.findOne({ where: { phone } });
            if (existingMember) {
                return res.status(400).json({ message: 'Phone number already exists. Please use a different phone.' });
            }

            // 创建新成员记录
            const newMember = await member.create({
                gender,
                isAdult,
                notes,
                phone,
                street,
                username
            }, { raw: true });

            // 发送成功响应
            res.status(201).json({ message: 'Member created successfully', member: newMember });
        } catch (error) {
            console.error('連接數據庫時出現錯誤：', error);
            res.status(500).send('Server Error');
        }
    }
);

module.exports = router;
