import { supabase } from './supabase';

export async function signUp(email, password) {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: 'https://daybooks-app.vercel.app/app',
    },
  });
}

export async function signIn(email, password) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { user, error };
}

export async function resetPassword(email) {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://daybooks-app.vercel.app/app',
  });
}