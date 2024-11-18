const express = require('express');
const router = express.Router();
const RAGController = require('../../rag/api/routes/ragController');

router.post('/query', RAGController.handleQuery);
router.post('/upload', RAGController.handleMaterialUpload);

module.exports = router;