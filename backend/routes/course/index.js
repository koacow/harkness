const supabase = require('../../utils/supabase');
require('dotenv').config();

const courseRouter = require('express').Router();

/**
 * GET /api/course
 * @summary Gets all course ids and roles for a user
 * @tags course
 * @param {string} userId.query.required - The user ID
 * @return {object} 200 - List of courses
 * @return {object} 500 - An error occurred
 */
courseRouter.get('/', async (req, res) => {
    const { userId } = req.query;
    try{
        const { data, error} = await supabase
        .from('courses_users')
        .select()
        .eq('user_id', userId);
        if (error){
            throw error;
        }
        res.status(200).json(data);
    } catch(e) {
        console.error('Error from Supabase:', e);
        res.status(500).json({ error: 'Failed to process your request.' });
    }
})

/**
 * POST /api/course/newcourse
 * @summary Creates a new course and sets the user as an instructor
 * @tags course
 * @param {string} userId.body.required - The user ID
 * @param {string} courseTitle.body.required - The course name
 * @param {string} courseDescription.body.required - The course description
 * @param {string} startDate.body.required - The course start date
 * @param {string} endDate.body.required - The course end date
 * @return {object} 200 - The course ID
 * @return {object} 500 - An error occurred
 */
courseRouter.post('/newcourse', async (req, res) => {
    const { userId, courseTitle, courseDescription } = req.body;
    try {
        const { data, error } = await supabase
        .from('course')
        .insert([
            { 
                id: crypto.randomUUID(), 
                created_at: new Date().toISOString(),
                title: courseTitle, 
                description: courseDescription,  
                start_date: startDate,
                end_date: endDate
            }
        ])
        .select();
        if (error) {
            throw error;
        }
        const courseId = data[0].id;
        await supabase
        .from('courses_users')
        .insert([
            { course_id: courseId, user_id: userId, is_instructor: true }
        ])
        .select();
        res.status(200).json(data);
    }
    catch(e) {
        console.error('Error from Supabase:', e);
        res.status(500).json({ error: 'Failed to process your request.' });
    }
});

/**
 * DELETE /api/course
 * @summary Deletes a course
 * @tags course
 * @param {string} courseId.body.required - The course ID
 * @param {string} userId.body.required - The user ID
 * @return {object} 200 - The course ID
 * @return {object} 500 - An error occurred
 * @return {object} 401 - Unauthorized
 * @return {object} 404 - Not found
 */
courseRouter.delete('/', async (req, res) => {
    const { courseId, userId } = req.query;
    try {
        const { data, error: courseFindError } = await supabase
        .from('courses_users')
        .select('is_instructor')
        .eq('course_id', courseId)
        .eq('user_id', userId);
        if (courseFindError) {
            throw courseFindError;
        }
        if (!data) {
            res.status(404).json({ error: 'Course not found.' });
        } else if (error) {
            throw error;
        } else if (!data[0].is_instructor) {
            res.status(401).json({ error: 'Unauthorized.' });
        }
        const { error: courseDeleteError } = await supabase
        .from('course')
        .delete()
        .eq('id', courseId);
        if (courseDeleteError) {
            throw courseDeleteError;
        }
        res.status(200).json(data);
    } catch(e) {
        console.error('Error from Supabase:', e);
        res.status(500).json({ error: 'Failed to process your request.' });
    }
});

module.exports = courseRouter;