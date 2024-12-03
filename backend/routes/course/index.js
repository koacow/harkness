const supabase = require('../../utils/supabase');
require('dotenv').config();

const courseRouter = require('express').Router();

/**
 * GET /api/course
 * @summary Gets a course by ID
 * @tags course
 * @param {string} courseId.query.required - The course ID
 * @return {object} 200 - The course
 * @return {object} 400 - Bad request
 * @return {object} 404 - Not found
 * @return {object} 500 - An error occurred
 */
courseRouter.get('/', async (req, res) => {
    const { courseId } = req.query;
    if (!courseId) {
        return res.status(400).json({ error: 'Missing required parameter(s): courseId' });
    }
    try {
        const { data, error } = await supabase
        .from('course')
        .select()
        .eq('id', courseId);
        if (error) {
            throw error;
        }
        if (!data[0]) {
            return res.status(404).json({ error: 'Course not found.' });
        }
        return res.status(200).json(data[0]);
    } catch(e) {
        console.error('Error from Supabase:', e);
        return res.status(500).json({ error: 'Failed to process your request.' });
    }
});

/**
 * GET /api/course/mycourses
 * @summary Gets all course ids and roles for a user
 * @tags course
 * @param {string} userId.query.required - The user ID
 * @return {object} 200 - List of courses
 * @return {object} 400 - Bad request
 * @return {object} 500 - An error occurred
 */
courseRouter.get('/', async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ error: 'Missing required parameter(s): userId' });
    }
    try{
        const { data, error} = await supabase
        .from('courses_users')
        .select()
        .eq('user_id', userId);
        if (error){
            throw error;
        }
        return res.status(200).json(data);
    } catch(e) {
        console.error('Error from Supabase:', e);
        return res.status(500).json({ error: 'Failed to process your request.' });
    }
})

/**
 * POST /api/course/newcourse
 * @summary Creates a new course and sets the user as an instructor
 * @tags course
 * @param {string} userId.body.required - The user ID
 * @param {string} courseTitle.body.required - The course name
 * @param {string} courseDescription.body.optional - The course description (default: '')
 * @param {string} startDate.body.required - The course start date
 * @param {string} endDate.body.required - The course end date
 * @return {object} 200 - The course ID
 * @return {object} 500 - An error occurred
 */
courseRouter.post('/newcourse', async (req, res) => {
    const { userId, courseTitle, courseDescription = '', startDate, endDate } = req.body;
    if (!userId || !courseTitle || !startDate || !endDate) {
        return res.status(400).json({ error: 'Missing required parameter(s): userId, courseTitle, startDate, endDate' });
    }
    try {
        const { data: courseData, error: courseCreateError } = await supabase
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
        if (courseCreateError) {
            throw courseCreateError;
        }
        const courseId = courseData[0].id;
        const { courseJoinTableCreateError} = await supabase
        .from('courses_users')
        .insert([
            { course_id: courseId, user_id: userId, is_instructor: true }
        ])
        .select();
        if (courseJoinTableCreateError) {
            throw courseJoinTableCreateError;
        }
        return res.status(200).json(courseData[0]);
    }
    catch(e) {
        console.error('Error from Supabase:', e);
        return res.status(500).json({ error: 'Failed to process your request.' });
    }
});

/**
 * PUT /api/course
 * @summary Updates a course
 * @tags course
 * @param {string} courseId.body.required - The course ID
 * @param {string} userId.body.required - The user ID
 * @param {string} courseTitle.body.required - The course name
 * @param {string} courseDescription.body.required - The course description
 * @param {string} startDate.body.required - The course start date
 * @param {string} endDate.body.required - The course end date
 * @return {object} 200 - The course ID
 * @return {object} 500 - An error occurred
 * @return {object} 401 - Unauthorized
 * @return {object} 404 - Not found
 * @return {object} 400 - Bad request
 * @return {object} 500 - An error occurred
 */
courseRouter.put('/', async (req, res) => {
    const { courseId, userId, courseTitle, courseDescription, startDate, endDate } = req.body;
    if (!courseId || !userId || !courseTitle || !courseDescription || !startDate || !endDate) {
        return res.status(400).json({ error: 'Missing required parameter(s): courseId, userId, courseTitle, courseDescription, startDate, endDate' });
    }
    try {
        const { data: courseUserReference, error: courseFindError } = await supabase
        .from('courses_users')
        .select('is_instructor')
        .eq('course_id', courseId)
        .eq('user_id', userId);
        if (courseFindError) {
            throw courseFindError;
        }
        if (!courseUserReference[0]) {
            return res.status(404).json({ error: 'Course not found.' });
        } else if (courseFindError) {
            throw courseFindError;
        } else if (!courseUserReference[0].is_instructor) {
            return res.status(401).json({ error: 'Unauthorized.' });
        }
        const { data: updatedCourseData, error: courseUpdateError } = await supabase
        .from('course')
        .update([
            { 
                title: courseTitle, 
                description: courseDescription,  
                start_date: startDate,
                end_date: endDate
            }
        ])
        .eq('id', courseId)
        .select('id');
        if (courseUpdateError) {
            throw courseUpdateError;
        }
        res.status(200).json(updatedCourseData[0]);
    } catch(e) {
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
    if (!courseId || !userId) {
        return res.status(400).json({ error: 'Missing required parameter(s): courseId, userId' });
    }
    try {
        const { data, error: courseFindError } = await supabase
        .from('courses_users')
        .select('is_instructor')
        .eq('course_id', courseId)
        .eq('user_id', userId);
        if (courseFindError) {
            throw courseFindError;
        }
        if (!data[0]) {
            return res.status(404).json({ error: 'Course not found.' });
        } else if (courseFindError) {
            throw courseFindError;
        } else if (!data[0].is_instructor) {
            return res.status(401).json({ error: 'Unauthorized.' });
        }
        const { error: courseDeleteError } = await supabase
        .from('course')
        .delete()
        .eq('id', courseId);
        if (courseDeleteError) {
            throw courseDeleteError;
        }
        return res.status(200).json(data);
    } catch(e) {
        console.error('Error from Supabase:', e);
        return res.status(500).json({ error: 'Failed to process your request.' });
    }
});

/**
 * POST /api/course/join
 * @summary Adds a user to a course
 * @tags course
 * @param {string} courseId.body.required - The course ID
 * @param {string} userId.body.required - The user ID
 * @param {boolean} isInstructor.body.required - Whether the user is an instructor
 * @return {object} 200 - The course ID
 * @return {object} 500 - An error occurred
 * @return {object} 404 - Not found
 * @return {object} 400 - Bad request
 * @return {object} 500 - An error occurred
 */

courseRouter.post('/join', async (req, res) => {
    const { courseId, userId, isInstructor } = req.body;
    if (!courseId || !userId || !isInstructor) {
        return res.status(400).json({ error: 'Missing required parameter(s): courseId, userId, isInstructor' });
    }
    try {
        const { data: courseData, error: courseFindError } = await supabase
        .from('course')
        .select()
        .eq('id', courseId);
        if (courseFindError) {
            throw courseFindError;
        }
        if (!courseData[0]) {
            return res.status(404).json({ error: 'Course not found.' });
        } else if (courseFindError) {
            throw courseFindError;
        }
        const { data: userData, error: userFindError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId);
        if (userFindError) {
            throw userFindError;
        }
        if (!userData[0]) {
            return res.status(404).json({ error: 'User not found.' });
        } else if (userFindError) {
            throw userFindError;
        }
        const { error: courseUserInsertError } = await supabase
        .from('courses_users')
        .insert([
            { course_id: courseId, user_id: userId, is_instructor: isInstructor }
        ]);
        if (courseUserInsertError) {
            throw courseUserInsertError;
        }
        return res.status(200).json({ message: 'User added to course.' });
    } catch(e) {
        console.error('Error from Supabase:', e);
        return res.status(500).json({ error: 'Failed to process your request.' });
    }
});

/**
 * DELETE /api/course/leave
 * @summary Removes a user from a course
 * @tags course
 * @param {string} courseId.body.required - The course ID
 * @param {string} userId.body.required - The user ID
 * @return {object} 200 - The course ID
 * @return {object} 400 - Bad request
 * @return {object} 404 - Not found
 * @return {object} 500 - An error occurred
 */
courseRouter.delete('/leave', async (req, res) => {
    const { courseId, userId } = req.query;
    if (!courseId || !userId) {
        return res.status(400).json({ error: 'Missing required parameter(s): courseId, userId' });
    }
    try {
        const { data: enrollmentData, error: enrollmentDataFindError } = await supabase
        .from('courses_users')
        .select()
        .eq('course_id', courseId)
        .eq('user_id', userId);
        if (enrollmentDataFindError) {
            throw enrollmentDataFindError;
        }
        if (!enrollmentData[0]) {
            return res.status(404).json({ error: 'Enrollment record not found.' });
        }
        const { error: courseUserDeleteError } = await supabase
        .from('courses_users')
        .delete()
        .eq('course_id', courseId)
        .eq('user_id', userId);
        if (courseUserDeleteError) {
            throw courseUserDeleteError;
        }
        return res.status(200).json({ message: 'User removed from course.' });
    } catch(e) {
        console.error('Error from Supabase:', e);
        return res.status(500).json({ error: 'Failed to process your request.' });
    }
});

module.exports = courseRouter;