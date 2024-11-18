const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const RAGProcessor = require('../../rag/core/processors/documentProcessor');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Use absolute path to uploads directory
        const uploadPath = '/Users/miki/Desktop/harkness/uploads';
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        // You can add file type restrictions here
        cb(null, true);
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit per file
    }
});

// Handle file uploads
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const courseId = req.body.courseId;

        // Your existing file saving logic
        const savedPath = file.path;
        
        // Add RAG processing
        const ragProcessor = new RAGProcessor();
        await ragProcessor.processDocument(savedPath, courseId);

        // Your existing response handling
        res.status(200).json({
            message: 'File uploaded and processed successfully',
            path: savedPath
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Error processing upload' });
    }
});

module.exports = router;