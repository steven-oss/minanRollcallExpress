const { member } = require('../models/miaanRollCall');
const { Op } = require('sequelize');

class MemberRepository {
    async findAllByUsername(username, page, pageSize) {
        const offset = (page - 1) * pageSize; // 計算偏移量
        return await member.findAndCountAll({
            where: {
                username: {
                    [Op.like]: `%${username}%`
                }
            },
            limit: pageSize, // 限制每頁的數量
            offset: offset // 設定偏移量
        });
    }
    

    async findPaginated(page, pageSize) {
        return await member.findAndCountAll({
            offset: (page - 1) * pageSize,
            limit: pageSize,
        });
    }

    async findById(id) {
        return await member.findByPk(id);
    }

    async createMember(memberData) {
        return await member.create(memberData);
    }

    async findByPhone(phone) {
        return await member.findOne({ where: { phone } });
    }

    async updateMember(memberInstance, updateData) {
        return await memberInstance.update(updateData);
    }

    async findByPhoneExcludingId(phone, excludeId) {
        return await member.findOne({
            where: {
                phone: phone,
                id: { [Op.ne]: excludeId }
            }
        });
    }
}

module.exports = new MemberRepository();
