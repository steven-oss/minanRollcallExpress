const rollCallRepository = require('../repositories/rollCallRepository')
const { member } = require('../models/miaanRollCall'); // 確保這裡的路徑正確

class RollCallService{
    async getPaginatedRollCall(date,page, pageSize) {
        const { count: total, rows: rollCallList } = await rollCallRepository.findPaginated(date,page, pageSize);
        return {
            rollCallList,
            pagination: {
                totalMembers: total,
                totalPages: Math.ceil(total / pageSize),
                currentPage: page,
                pageSize
            }
        };
    }

    async createRollCall(date) {
        // 1. 從 member 表中獲取所有成員
        const members = await member.findAll({
            attributes: ['id', 'username', 'gender', 'isAdult']  // 只選擇我們需要的欄位
        });

        // 2. 構建需要插入 RollCall 表的資料
        const rollCallData = members.map(m => ({
            gender: m.gender,
            isAdult: m.isAdult,
            username: m.username,
            memberId: m.id,
            date: date,  // 使用傳遞的日期
            check: false  // 假設初始為未簽到
        }));

        // 3. 檢查是否存在相同的 memberId 和 date 組合
        const existingRecords = await rollCallRepository.findExistingRecords(date, rollCallData.map(entry => entry.memberId));

        // 將已存在的 memberId 儲存到一個集合中以進行快速查找
        const existingMemberIds = new Set(existingRecords.map(record => record.memberId));

        // 檢查每個要插入的資料是否已存在
        for (const entry of rollCallData) {
            if (existingMemberIds.has(entry.memberId)) {
                throw new Error(`Date "${date}" has already been added for member ID ${entry.memberId}.`);
            }
        }

        // 4. 批量插入 RollCall 表
        await rollCallRepository.bulkCreate(rollCallData);
    }
}

module.exports = new RollCallService();