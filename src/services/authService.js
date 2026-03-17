import { supabase } from '../supabase';

// Demo mode using localStorage if Supabase is not configured
const DEMO_MODE = !supabase;

console.log(DEMO_MODE ? '🔴 Auth Demo Mode' : '📡 Auth Supabase Mode');

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

    const { data: { session } } = await supabase.auth.getSession();
    
    // Only sign out if there's an active session
    if (session) {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
    }
  } catch (error) {
    // Log but don't throw - logout should always succeed
    console.warn('Logout warning:', error.message);
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

  let subscription = null;
  let timeoutId = null;
  let hasResponded = false;

  // Set a timeout to fall back to demo mode if auth doesn't respond in 3 seconds
  timeoutId = setTimeout(() => {
    if (!hasResponded) {
      console.warn('⚠️ Auth state subscription timeout - falling back to demo mode');
      hasResponded = true;
      
      // Unsubscribe from the hanging connection
      if (subscription?.unsubscribe) {
        try {
          subscription.unsubscribe();
        } catch (e) {
          // Silently ignore unsubscribe errors
        }
      }
      
      // Fall back to demo mode
      const demoUser = localStorage.getItem('demoUser');
      callback(demoUser ? JSON.parse(demoUser) : null);
    }
  }, 3000);

  try {
    const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!hasResponded) {
          hasResponded = true;
          clearTimeout(timeoutId);
          
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
      }
    );
    subscription = sub;
  } catch (error) {
    console.warn('⚠️ Auth state subscription error:', error.message);
    if (!hasResponded) {
      hasResponded = true;
      clearTimeout(timeoutId);
      
      // Fall back to demo mode
      const demoUser = localStorage.getItem('demoUser');
      callback(demoUser ? JSON.parse(demoUser) : null);
    }
  }

  return () => {
    clearTimeout(timeoutId);
    try {
      subscription?.unsubscribe?.();
    } catch (e) {
      // Silently ignore unsubscribe errors
    }
  };
};

export const authService = {
  register,
  login,
  logout,
  subscribeToAuthStateChange,
};
