import axios from 'axios';
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const getChatHistory = async (chatId) => {
    const params = {
        chatId
    }
    const response = await axios.get(`${SERVER_URL}/chat`, { params });
    switch (response.status) {
        case 200: 
            return response.data;
        default:
            throw new Error(response.data.error);
    }
};

export const sendMessage = async (chatId, userId, text) => {
    const body = {
        chatId,
        userId,
        text
    }
    const response = await axios.post(`${SERVER_URL}/chat`, body);
    switch (response.status) {
        case 200: 
            return response.data;
        default:
            throw new Error(response.data.error);
    }
};

export const createChat = async (userId, courseId) => {
    const body = {
        userId,
        courseId
    };
    const response = await axios.post(`${SERVER_URL}/chat/newchat`, body);
    switch (response.status) {
        case 200: 
            return response.data;
        default:
            throw new Error(response.data.error);
    }
};

export const deleteChat = async (chatId) => {
    const params = {
        chatId
    }
    const response = await axios.delete(`${SERVER_URL}/chat`, { params });
    switch (response.status) {
        case 200: 
            return response.data;
        default:
            throw new Error(response.data.error);
    }
};
