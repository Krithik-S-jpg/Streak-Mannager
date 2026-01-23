import { supabase } from '../supabase';

export const register = async (email, password, displayName) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) throw new Error(error.message);

    const user = data.user;
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: user.id,
          email: user.email,
          display_name: displayName,
          theme: 'dark',
          notifications_enabled: true,
          created_at: new Date(),
        },
      ]);

    if (profileError) throw new Error(profileError.message);

    return { user: { uid: user.id, email: user.email, displayName } };
  } catch (error) {
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    const user = data.user;
    return {
      user: {
        uid: user.id,
        email: user.email,
        displayName: user.user_metadata?.display_name || email.split('@')[0],
      },
    };
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  } catch (error) {
    throw error;
  }
};

export const subscribeToAuthStateChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (session?.user) {
        const user = session.user;
        callback({
          uid: user.id,
          email: user.email,
          displayName: user.user_metadata?.display_name || user.email.split('@')[0],
        });
      } else {
        callback(null);
      }
    }
  );

  return () => {
    subscription?.unsubscribe();
  };
};

export const authService = {
  register,
  login,
  logout,
  subscribeToAuthStateChange,
};
