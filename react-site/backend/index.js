const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
const chatRouter = require('./routes/chat');
const courseRouter = require('./routes/course');
require('dotenv').config();

const app = express();
const PORT = 4000;
const BASE_PATH = '/api';

app.use(cors());
app.use(express.json());

app.use(`${BASE_PATH}/chat`, chatRouter);
app.use(`${BASE_PATH}/course`, courseRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
