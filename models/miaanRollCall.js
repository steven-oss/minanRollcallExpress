const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('minaanrollcall',process.env.MYSQL_USERNAME,process.env.MYSQL_PASSWORD,{
    host:process.env.MYSQL_HOSTNAME,
    dialect:'mysql'
})

const gender = require('./mysql/gender')(sequelize,Sequelize)
const member = require('./mysql/member')(sequelize,Sequelize)
const rollCall = require('./mysql/rollcall')(sequelize,Sequelize)

// 設定關聯
member.hasMany(rollCall, {
    foreignKey: 'memberId', // 外鍵
    sourceKey: 'id', // 對應到 member 的 id
  });
  rollCall.belongsTo(member, {
    foreignKey: 'memberId', // 外鍵
    targetKey: 'id', // 對應到 member 的 id
  });

module.exports={
    gender,
    member,
    rollCall
}