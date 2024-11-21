const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

//import upload routes
const uploadRoutes = require('./routes/uploadRoutes');

// Keep this line
app.use('/api/upload', uploadRoutes);   

app.post('/api/ask', async (req, res) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: req.body.messages
        });
        res.json(completion.choices[0].message);
    } catch (error) {
        console.error('Error from OpenAI:', error);
        res.status(500).json({ error: 'Failed to process your request.' });
    }
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});
