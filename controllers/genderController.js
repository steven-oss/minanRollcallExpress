const genderService = require('../services/genderService')

exports.getGenders = async (req,res)=>{
    try{
        const genderList = await genderService.getAllGenders();
        console.log(genderList)
        res.json({
            message: 'successful',
            data: genderList
        });
    }catch(error){
        console.error('連接數據庫時出現錯誤：', error)
        res.status(500).send('Server Error')
    }
}