const memberRepository = require('../repositories/memberRepository');

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

    async updateMember(id, updateData) {
        const member = await memberRepository.findById(id);
        if (!member) {
            throw new Error('No member found with the given id');
        }
        await memberRepository.updateMember(member, updateData);
        return member;
    }
}

module.exports = new MemberService();
