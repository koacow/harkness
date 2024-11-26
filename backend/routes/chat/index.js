const chatRouter = require('express').Router();
const OpenAI = require('openai');
const supabase = require('../../utils/supabase');
require('dotenv').config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/**
 * POST /api/chat
 * @summary This endpoint is used to send a message to the chatbot, save it to the database, and return the chatbot's response.
 * @tags chat
 * @param {string} text.body.required - The message to send to the chatbot
 * @param {string} chatId.body.required - The chat ID
 * @param {string} userId.body.required - The user ID
 * @return {object} 200 - The chatbot's response
 * @return {object} 500 - An error occurred
 */
chatRouter.post('/', async (req, res) => {
    const { text, chatId, userId } = req.body;
    try{
        const { data, error } = await supabase
        .from('chat_text')
        .insert([
            { chat_id: chatId, user_id: userId, text: text }
        ])
        .select();
        if (error){
            throw error;
        }
    } catch(e) {
        console.error('Error from Supabase:', e);
        return res.status(500).json({ error: 'Failed to process your request.' });
    }
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: req.body.text
        });
        // TODO: Save the chatbot's response to the database
        return res.status(200).json(completion.choices[0].message);
    } catch (error) {
        console.error('Error from OpenAI:', error);
        return res.status(500).json({ error: 'Failed to process your request.' });
    }
});

/**
 * GET /api/chat
 * @summary This endpoint is used to get all messages from a chat.
 * @tags chat
 * @param {string} chatId.query.required - The chat ID
 * @return {object} 200 - The chat messages
 * @return {object} 500 - An error occurred
 */
chatRouter.get('/', async (req, res) => {
    const { chatId } = req.query;
    try {
        const { data, error } = await supabase
        .from('chat_text')
        .select('text')
        .order('created_at', { ascending: true })  
        .eq('chat_id', chatId);
        if (error) {
            throw error;
        }
        return res.status(200).json(data);
    } catch(e) {
        console.error('Error from Supabase:', e);
        return res.status(500).json({ error: 'Failed to process your request.' });
    }
});

/**
 * POST /api/chat/newchat
 * @summary This endpoint is used to create a new chat with the chatbot.
 * @tags chat
 * @param {string} userId.body.required - The user ID
 * @return {object} 200 - The chat ID
 * @return {object} 500 - An error occurred
 */
chatRouter.post('/newchat', async (req, res) => {
    const { userId } = req.body;
    try {
        const { data, error } = await supabase
        .from('chat')
        .insert([
            { id: crypto.randomUUID(), created_at: new Date().toISOString(), user_id: userId }
        ])
        .select();
        if (error) {
            throw error;
        }
        return es.status(200).json(data);
    } catch(e) {
        console.error('Error from Supabase:', e);
        return res.status(500).json({ error: 'Failed to process your request.' });
    }
});

/**
 * DELETE /api/chat
 * @summary This endpoint is used to delete an entire chat.
 * @tags chat
 * @param {string} chatId.query.required - The chat ID
 * @return {object} 200 - The chat was deleted
 * @return {object} 500 - An error occurred
 * @return {object} 404 - The chat was not found
 */
chatRouter.delete('/', async (req, res) => {
    const { chatId } = req.query;
    try {
        const { data, error } = await supabase
        .from('chat')
        .delete()
        .eq('id', chatId)
        .select();
        if (!data) {
            return res.status(404).json({ error: 'Chat not found.' });
        } else if (error) {
            throw error;
        }
        else {
            return res.status(200).json({ message: 'Chat deleted.' });
        }
    } catch(e) {
        console.error('Error from Supabase:', e);
        return res.status(500).json({ error: 'Failed to process your request.' });
    }
});

module.exports = chatRouter;