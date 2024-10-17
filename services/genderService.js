const genderRepository = require('../repositories/genderRepository')


class GenderService{
    async getAllGenders(){
        return await genderRepository.findAll();
    }
}

module.exports = new GenderService();