import validator from 'validator';
import supabase from "./supabase";

/**
 * validate email address
 * @param {string} email - Email to validate
 * @throws {Error} - Throws an error if email is invalid
 */
const validateEmail = (email) => {
    // Trim the email and normalize it
    const trimmedEmail = validator.trim(email);
    
    // check if email is empty
    if (validator.isEmpty(trimmedEmail)) {
        throw new Error('Email is required');
    }
    
    // validate email format
    if (!validator.isEmail(trimmedEmail)) {
        throw new Error('Invalid email format');
    }
    
    // additional email validations
    if (trimmedEmail.length > 254) {
        throw new Error('Email is too long');
    }
    
    return trimmedEmail;
};

/**
 * validate password strength
 * @param {string} password - password to validate
 * @throws {Error} - throws an error if password doesn't meet criteria
 */
const validatePassword = (password) => {
    // trim passworf ( removes whitespace)
    const trimmedPassword = validator.trim(password);
    
    // check if password is empty
    if (validator.isEmpty(trimmedPassword)) {
        throw new Error('Password is required');
    }
    
    // password strength requirements
    if (trimmedPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long');
    }
    
    // check for at least one uppercase, one lowercase, one number, and one special character - we can change this is we want more/less security
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
 * Function to sign up a new user with enhanced validation
 * @param {string} email - The user's email address
 * @param {string} password - The user's password
 * @returns {Promise} - The user's data or throws an error
 */
export const signUpNewUser = async (email, password) => {
    try {
        // validate inputs
        const validatedEmail = validateEmail(email);
        const validatedPassword = validatePassword(password);
        
        // this basically standardizes the email, we don't really need it but its nice to have
        //essentially makes sure that two of the same emails are treated the same Testing@gmail.com == testing@gmail.com
        const sanitizedEmail = validator.normalizeEmail(validatedEmail, {
            gmail_remove_dots: false,
            gmail_remove_subaddress: false
            
        });
        
        // Attempt signup
        const { data, error } = await supabase.auth.signUp({
            email: sanitizedEmail,
            password: validatedPassword,
            options: {
                // once the user confirms their email, they will get sent to this url, for rn Ive just made it the local host, but when we publish this would prolly be the login page or welcome page
                emailRedirectTo: process.env.EMAIL_REDIRECT_URL || 'https://http://localhost:3000',
            },
        });
        
        // Check for signup errors
        if (error) {
            throw new Error(error.message || 'Signup failed');
        }
        
        return data;
    } catch (error) {
        // log the error (use a proper logging mechanism in production)
        console.error('Signup Error:', error.message);
        
        // re-throw to allow caller to handle
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
        // validate inputs
        const validatedEmail = validateEmail(email);
        const validatedPassword = validatePassword(password);
        
        // sanitize email
        const sanitizedEmail = validator.normalizeEmail(validatedEmail, {
            gmail_remove_dots: false,
            gmail_remove_subaddress: false
        });
        
        // attempt login
        const { data, error } = await supabase.auth.signInWithPassword({
            email: sanitizedEmail,
            password: validatedPassword
        });
        
        // check for login errors
        if (error) {
            throw new Error(error.message || 'Login failed');
        }
        
        return data;
    } catch (error) {
        // log the error (use a proper logging mechanism in production)
        console.error('Login Error:', error.message);
        
        // re-throw to allow caller to handle
        throw error;
    }
};

