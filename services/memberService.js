const memberRepository = require('../repositories/memberRepository');
const { rollCall } = require('../models/miaanRollCall'); // 確保這裡的路徑正確

class MemberService {
    async searchMembersByUsername(username) {
        const members = await memberRepository.findAllByUsername(username);
        if (members.length === 0) {
            throw new Error('No members found');
        }
        return members;
    }

    async getPaginatedMembers(page, pageSize) {
        const { count: total, rows: memberList } = await memberRepository.findPaginated(page, pageSize);
        return {
            memberList,
            pagination: {
                totalMembers: total,
                totalPages: Math.ceil(total / pageSize),
                currentPage: page,
                pageSize
            }
        };
    }

    async getMemberById(id) {
        const member = await memberRepository.findById(id);
        if (!member) {
            throw new Error('No member found with the given id');
        }
        return member;
    }

    async createMember(memberData) {
        const existingMember = await memberRepository.findByPhone(memberData.phone);
        if (existingMember) {
            throw new Error('Phone number already exists. Please use a different phone.');
        }
        return await memberRepository.createMember(memberData);
    }

    async updateMemberAndRollCalls(id, updateData) {
        const member = await memberRepository.findById(id);
        if (!member) {
            throw new Error('No member found with the given id');
        }

        // 更新會員資料
        await memberRepository.updateMember(member, updateData);

        // 更新對應的 RollCall 記錄
        await rollCall.update(
            {
                gender: updateData.gender, // 假設要更新 gender
                username: updateData.username, // 假設要更新 username
                isAdult:updateData.isAdult,
            }, 
            { where: { memberId: id } } // 使用外鍵查找 RollCall
        );

        // 返回更新後的會員資料
        return await memberRepository.findById(id); // 可選：回傳更新後的會員資料
    }
}

module.exports = new MemberService();
