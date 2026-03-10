'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect('/auth/login?error=' + encodeURIComponent(error.message));
  }

  redirect('/dashboard');
}

export async function register(formData: FormData) {
  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        organization_name: formData.get('organization_name') as string,
        sector: formData.get('sector') as string,
      },
    },
  });

  if (error) {
    redirect('/auth/register?error=' + encodeURIComponent(error.message));
  }

  redirect('/auth/register?success=true');
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/auth/login');
}
