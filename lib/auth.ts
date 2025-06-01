// // lib/auth.ts
// import { supabase } from './supabaseClient';

// export const signIn = async (email: string, password: string) => {
//   return supabase.auth.signInWithPassword({ email, password });
// };

// export const signOut = async () => {
//   return supabase.auth.signOut();
// };

// export const getUser = async () => {
//   const { data } = await supabase.auth.getUser();
//   return data.user;
// };