import { supabase } from '../supabase';

// Demo mode using localStorage if Supabase is not configured
const DEMO_MODE = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

export const register = async (email, password, displayName) => {
  try {
    if (DEMO_MODE) {
      // Demo mode - store user in localStorage
      const userId = 'demo-user-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('demoUser', JSON.stringify({
        uid: userId,
        email,
        displayName: displayName || email.split('@')[0],
      }));
      return {
        user: {
          uid: userId,
          email,
          displayName: displayName || email.split('@')[0],
        },
      };
    }

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
    if (DEMO_MODE) {
      // Demo mode - simple login simulation
      const userId = localStorage.getItem('demoUserId') || 'demo-user-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('demoUserId', userId);
      localStorage.setItem('demoUser', JSON.stringify({
        uid: userId,
        email,
        displayName: email.split('@')[0],
      }));
      return {
        user: {
          uid: userId,
          email,
          displayName: email.split('@')[0],
        },
      };
    }

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
    if (DEMO_MODE) {
      localStorage.removeItem('demoUser');
      localStorage.removeItem('demoUserId');
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  } catch (error) {
    throw error;
  }
};

export const subscribeToAuthStateChange = (callback) => {
  if (DEMO_MODE) {
    // Demo mode - check localStorage for user
    const demoUser = localStorage.getItem('demoUser');
    if (demoUser) {
      callback(JSON.parse(demoUser));
    } else {
      callback(null);
    }
    // Return unsubscribe function
    return () => {};
  }

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
