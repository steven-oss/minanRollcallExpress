const express = require('express');
const router = express.Router();
const { member,sequelize } = require('../../models/miaanRollCall'); // 確保這裡的路徑正確


router.post('/', async (req, res) => {
    const { date } = req.body; // 獲取請求中的日期
    const tableName = date.replace(/-/g, '_'); // 將日期格式轉換為有效的表名
    
    try {
        // 檢查資料表是否存在
        const [results] = await sequelize.query(`
            SHOW TABLES LIKE '${tableName}'
        `);

        if (results.length > 0) {
            return res.status(400).json({ message: `Table "${tableName}" already exists.` });
        }

        // 動態創建資料表
        await sequelize.query(`CREATE TABLE ${tableName} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            memberName VARCHAR(255) NOT NULL,
            notes TEXT,
            attendanceStatus ENUM('present', 'absent', 'late', 'excused') DEFAULT 'absent'
        )`);

        // 獲取所有成員的名稱和備註
        const members = await member.findAll();
        // 構建插入資料的陣列，過濾掉 username 為 null 或空的成員
        const rollCallData = members.map(m => {
            return {
                memberName: m.dataValues.username, // 使用 username
                notes: m.dataValues.notes, // 獲取備註
                attendanceStatus: 'absent', // 預設為缺席
            };
        }).filter(m => m.memberName); // 只保留有 memberName 的成員

        // 確保 rollCallData 不為空
        if (rollCallData.length === 0) {
            return res.status(400).json({ message: 'No valid members to add to the roll call.' });
        }

        // 使用 ORM 的 bulkInsert 方法批量插入資料
        await sequelize.getQueryInterface().bulkInsert(tableName, rollCallData);

        res.status(201).json({ message: 'successful', tableName });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating roll call table', error });
    }
});

module.exports = router;
