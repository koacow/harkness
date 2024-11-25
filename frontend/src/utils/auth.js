import supabase from "./supabase";

// TODO: Implement signUpNewUser function with more options
export const signUpNewUser = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
        email: 'example@email.com',
        password: 'example-password',
        options: {
          emailRedirectTo: 'https://example.com/welcome',
        },
    })
}

// TODO: Implement signInWithEmail function
export const signInWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
}