const {gender} = require("../models/miaanRollCall")

class GenderRepository{
    async findAll(){
        return await gender.findAll({raw:true})
    }
}

module.exports = new GenderRepository();