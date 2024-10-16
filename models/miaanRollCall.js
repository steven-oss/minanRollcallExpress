const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('minaanrollcall',process.env.MYSQL_USERNAME,process.env.MYSQL_PASSWORD,{
    host:process.env.MYSQL_HOSTNAME,
    dialect:'mysql'
})

const gender = require('./mysql/gender')(sequelize,Sequelize)

module.exports={
    gender
}