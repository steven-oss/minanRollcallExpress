const express = require('express');
const router = express.Router();
const memberController = require('../../controllers/memberController');

router.get('/search', memberController.searchMembers);
router.get('/pagination', memberController.getPaginatedMembers);
router.get('/:id', memberController.getMemberById);
router.post('/', memberController.createMember);
router.put('/:id', memberController.updateMember);

module.exports = router;
