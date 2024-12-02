/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import validator from 'validator';
import {supabase} from './supabase';

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @throws {Error} - Throws an error if email is invalid
 */
const validateEmail = (email) => {
    // Trim the email and normalize it
    const trimmedEmail = validator.trim(email);
    
    // Check if email is empty
    if (validator.isEmpty(trimmedEmail)) {
        throw new Error('Email is required');
    }
    
    // Validate email format
    if (!validator.isEmail(trimmedEmail)) {
        throw new Error('Invalid email format');
    }
    
    // Additional email validations
    if (trimmedEmail.length > 254) {
        throw new Error('Email is too long');
    }
    
    return trimmedEmail;
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @throws {Error} - Throws an error if password doesn't meet criteria
 */
const validatePassword = (password) => {
    // Trim the password
    const trimmedPassword = validator.trim(password);
    
    // Check if password is empty
    if (validator.isEmpty(trimmedPassword)) {
        throw new Error('Password is required');
    }
    
    // Password strength requirements
    if (trimmedPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long');
    }
    
    // Check for at least one uppercase, one lowercase, one number, and one special character
    if (
        !/[A-Z]/.test(trimmedPassword) || 
        !/[a-z]/.test(trimmedPassword) || 
        !/[0-9]/.test(trimmedPassword) || 
        !/[!@#$%^&*(),.?":{}|<>]/.test(trimmedPassword)
    ) {
        throw new Error('Password must include uppercase, lowercase, number, and special character');
    }
    
    return trimmedPassword;
};

/**
 * Register a new user in the Supabase database
 * @param {string} email - The user's email address
 * @param {string} password - The user's password
 * @param {string} firstName - The user's first name
 * @param {string} lastName - The user's last name
 * @returns {Promise} - The user's data or throws an error
 */
export const registerUser = async (email, password, firstName, lastName) => {
    try {
        // Validate inputs
        const validatedEmail = validateEmail(email);
        const validatedPassword = validatePassword(password);
        
        // Sanitize email
        const sanitizedEmail = validator.normalizeEmail(validatedEmail, {
            gmail_remove_dots: false,
            gmail_remove_subaddress: false
        });
        

        
        // Register user
        const { data, error } = await supabase.auth.signUp({
            email: sanitizedEmail,
            password: validatedPassword,
          })
         
        // add users data to database
        const { userdata, userdataerror } = await supabase.from('users').insert([
            { first_name: firstName, last_name: lastName }
        ]).select()
        
        // Check for auth errors
        if (error) {
            throw new Error(error.message || 'Registration failed');
        }
        if (userdataerror) {
            throw new Error(userdatarror.message || 'Registration failed');
        }
        else {
            console.log(userdata)

        }

        

        
        return data[0]; // Return the newly created user data
    } catch (error) {
        // Log the error (use a proper logging mechanism in production)
        console.error('Registration Error:', error.message);
        
        // Re-throw to allow caller to handle
        throw error;
    }
};

/**
 * Function to sign in a user with email and password
 * @param {string} email - The user's email address
 * @param {string} password - The user's password
 * @returns {Promise} - The user's data or throws an error
 */
export const signInWithEmail = async (email, password) => {
    try {
        // Validate inputs
        const validatedEmail = validateEmail(email);
        const validatedPassword = validatePassword(password);
        
        // Sanitize email
        const sanitizedEmail = validator.normalizeEmail(validatedEmail, {
            gmail_remove_dots: false,
            gmail_remove_subaddress: false
        });
        
        // Attempt login
        const { data, error } = await supabase.auth.signInWithPassword({
            email: sanitizedEmail,
            password: validatedPassword
        });
        
        // Check for login errors
        if (error) {
            throw new Error(error.message || 'Login failed');
        }
        
        return data;
    } catch (error) {
        // Log the error (use a proper logging mechanism in production)
        console.error('Login Error:', error.message);
        
        // Re-throw to allow caller to handle
        throw error;
    }
};