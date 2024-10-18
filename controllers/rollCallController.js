const rollCallService= require('../services/rollCallService')


// 建立表單
exports.createRollCall = async (req, res) => {
    const { date } = req.body; // 假設前端傳遞日期，應為 YYYY-MM-DD 格式

    try {
        await rollCallService.createRollCall(date);
        res.status(201).json({ message: 'Roll call created successfully.' });
    } catch (error) {
        console.error(error);
        if (error.message.includes('has already been added')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error creating roll call.', error });
    }
};

// 分頁顯示點名表
exports.getPaginatedRollCall = async (req, res) => {
    const {date} = req.query;

    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        if(!date){
            return res.status(400).json({ message: 'Date parameter is required.' });
        }
        const paginatedData = await rollCallService.getPaginatedRollCall(date,page, pageSize);
        res.json({ message: 'successful', data: paginatedData.rollCallList, pagination: paginatedData.pagination });
    } catch (error) {
        console.error('連接數據庫時出現錯誤：', error);
        res.status(500).send('Server Error');
    }
};

