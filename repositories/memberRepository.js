const { member } = require('../models/miaanRollCall');
const { Op } = require('sequelize');

class MemberRepository {
    async findAllByUsername(username) {
        return await member.findAll({
            where: {
                username: {
                    [Op.like]: `%${username}%`
                }
            }
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
}

module.exports = new MemberRepository();
