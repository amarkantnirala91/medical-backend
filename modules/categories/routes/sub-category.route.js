const express = require('express');
const { addSubCategory, updateSubCategory, getAllSubCategory, getSubCategoryByCategory } = require('../controllers/sub-category.controller');
const router = express.Router();

router.post('/sub-category', addSubCategory);
router.put('/sub-category/:subCatId', updateSubCategory);
router.get('/sub-category', getAllSubCategory);
router.get('/sub-category/:catId', getSubCategoryByCategory)
module.exports = router