const {rollCall} = require('../models/miaanRollCall')
const { Op } = require('sequelize');


class RollCallRepository{
    async findPaginated(date,page, pageSize) {
        return await rollCall.findAndCountAll({
            where: {
                date: {
                    [Op.gte]: new Date(date + 'T00:00:00Z'), // 00:00:00
                    [Op.lt]: new Date(date + 'T23:59:59Z')  // 23:59:59
                }
            },
            offset: (page - 1) * pageSize,
            limit: pageSize,
        });
    }

    async findExistingRecords(date, memberIds) {
        return await rollCall.findAll({
            where: {
                date: {
                    [Op.gte]: new Date(date + 'T00:00:00Z'),
                    [Op.lt]: new Date(date + 'T23:59:59Z')
                },
                memberId: {
                    [Op.in]: memberIds // 使用成員ID陣列來查詢
                }
            }
        });
    }

    async bulkCreate(rollCallData) {
        return await rollCall.bulkCreate(rollCallData);
    }

    async findAllByUsername(username) {
        return await rollCall.findAll({
            where: {
                username: {
                    [Op.like]: `%${username}%`
                }
            }
        });
    }

    async findRollCallById (id) {
        return await rollCall.findByPk(id);
    }

    async updateCheckStatus(id,check){
        // 使用 Sequelize 更新資料庫
      const rollCallRecord = await rollCall.findByPk(id);
  
      if (!rollCallRecord) {
        return null;
    }
  
      // 更新 check 欄位
      rollCallRecord.check = check;
      await rollCallRecord.save();
    }
}


module.exports = new RollCallRepository();