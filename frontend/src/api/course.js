import axios from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const getCoursesByUserId = async (userId) => {
    const params = {
        userId
    }
    const response = await axios.get(`${SERVER_URL}/course/mycourses`, { params });
    switch (response.status) {
        case 200: 
            return response.data;
        default:
            throw new Error(response.data.error);
    }
}

export const getCourseById = async (courseId) => {
    const params = {
        courseId
    }
    const response = await axios.get(`${SERVER_URL}/course`, { params });
    switch (response.status) {
        case 200: 
            return response.data;
        default:
            throw new Error(response.data.error);
    }
}

export const createCourse = async (userId, courseTitle, courseDescription, startDate, endDate) => {
    const body = {
        userId,
        courseTitle,
        courseDescription,
        startDate,
        endDate
    };
    const response = await axios.post(`${SERVER_URL}/course`, body);
    switch (response.status) {
        case 200: 
            return response.data;
        default:
            throw new Error(response.data.error);
    }
};

export const updateCourse = async (courseId, courseTitle, courseDescription, startDate, endDate) => {
    const body = {
        courseId,
        courseTitle,
        courseDescription,
        startDate,
        endDate
    };
    const response = await axios.put(`${SERVER_URL}/course`, body);
    switch (response.status) {
        case 200: 
            return response.data;
        default:
            throw new Error(response.data.error);
    }
}

export const deleteCourse = async (courseId, userId) => {
    const params = {
        courseId,
        userId
    }
    const response = await axios.delete(`${SERVER_URL}/course`, { params });
    switch (response.status) {
        case 200: 
            return response.data;
        default:
            throw new Error(response.data.error);
    }
};

export const joinCourse = async (userId, courseId, isInstructor = false) => {
    const body = {
        userId,
        courseId,
        isInstructor
    };
    const response = await axios.post(`${SERVER_URL}/course/join`, body);
    switch (response.status) {
        case 200: 
            return response.data;
        default:
            throw new Error(response.data.error);
    }
};

export const leaveCourse = async (userId, courseId) => {
    const params = {
        userId,
        courseId
    }
    const response = await axios.delete(`${SERVER_URL}/course/leave`, { params });
    switch (response.status) {
        case 200: 
            return response.data;
        default:
            throw new Error(response.data.error);
    }
};

