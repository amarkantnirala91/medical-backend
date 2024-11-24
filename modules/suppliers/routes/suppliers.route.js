const express = require('express');
const { addSupplier } = require('../controllers/suppliers.controller');
const upload = require('../../../middlewares/upload');
const router = express.Router();

router.post("/upload",upload.single('file'), addSupplier)
module.exports = router