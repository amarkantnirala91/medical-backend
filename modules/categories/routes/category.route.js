const express = require('express');
const { addCategory, getAllCategory, updateCategory } = require('../controllers/category.controller');
const router = express.Router();

router.post('/category', addCategory)
router.get('/category', getAllCategory)
router.get('/category/:catId', updateCategory)
module.exports = router