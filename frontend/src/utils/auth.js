import supabase from "./supabase";

/**
 * Function to sign up a new user
 * @param {string} email - The user's email address
 * @param {string} password - The user's password
 * @param {string} firstName - The user's first name
 * @param {string} lastName - The user's last name
 * @returns {Promise} - The user's data or null if an error occurred 
 */
export const signUpNewUser = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
        email: 'example@email.com',
        password: 'example-password',
        options: {
          emailRedirectTo: 'https://example.com/welcome',
        },
    })
}

/**
 * Function to sign in a user with email and password
 * @param {string} email - The user's email address
 * @param {string} password - The user's password
 * @returns {Promise} - The user's data or null if an error occurred 
 */
export const signInWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
}