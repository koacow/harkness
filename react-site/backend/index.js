const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
const chatRouter = require('./routes/chat');
require('dotenv').config();

const app = express();
const PORT = 4000;
const BASE_PATH = '/api';

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(`${BASE_PATH}/chat`, chatRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
