const mysql = require('mysql2/promise')

async function mysqlConnection() {
    try{
        const connection = await mysql.createConnection({
            host:process.env.MYSQL_HOSTNAME,
            port:3306,
            user:process.env.MYSQL_USERNAME,
            database:'book',
            password:process.env.MYSQL_PASSWORD
        })

        return connection();

    }catch(error){
        console.error('連接數據庫時出現錯誤：',error)
    }
}
module.exports = {
    mysqlConnection
}