const chatRouter = require('express').Router();
const OpenAI = require('openai');
require('dotenv').config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

chatRouter.post('/', async (req, res) => {
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

module.exports = chatRouter;