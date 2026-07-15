import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { mockAuth } from './mockAuth';

export type AuthUser = {
  uid: string;
  email: string;
  name: string;
  role: string;
};

// Check if Firebase environment variables are configured
const isFirebaseConfigured =
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID;

let auth: any = null;

if (isFirebaseConfigured) {
  try {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    console.log('[+] Firebase Auth inicializado correctamente.');
  } catch (error) {
    console.error('[!] Error al inicializar Firebase SDK:', error);
  }
} else {
  console.log('[*] Firebase no configurado. Utilizando Simulador Local (Offline).');
}

export const authService = {
  // Sign up a new user
  signUp: async (email: string, password: string, name: string): Promise<AuthUser> => {
    if (auth) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save display name in Firebase Profile
      await updateProfile(user, { displayName: name });
      
      const role = email.startsWith('admin') ? 'admin' : 'user';
      
      // Register/sync user profile in MongoDB
      const token = await user.getIdToken();
      localStorage.setItem('runa_auth_token', token);
      await syncUserWithBackend(token);
      
      return {
        uid: user.uid,
        email: user.email || '',
        name: name,
        role: role,
      };
    } else {
      const mockUser = await mockAuth.signUp(email, password, name);
      await syncUserWithBackend(localStorage.getItem('runa_auth_token') || '');
      window.dispatchEvent(new Event('mock-auth-change'));
      return mockUser;
    }
  },

  // Sign in an existing user
  signIn: async (email: string, password: string): Promise<AuthUser> => {
    if (auth) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const role = email.startsWith('admin') ? 'admin' : 'user';
      
      const token = await user.getIdToken();
      localStorage.setItem('runa_auth_token', token);
      await syncUserWithBackend(token);

      return {
        uid: user.uid,
        email: user.email || '',
        name: user.displayName || email.split('@')[0],
        role: role,
      };
    } else {
      const mockUser = await mockAuth.signIn(email, password);
      await syncUserWithBackend(localStorage.getItem('runa_auth_token') || '');
      window.dispatchEvent(new Event('mock-auth-change'));
      return mockUser;
    }
  },

  // Sign out user
  signOut: async (): Promise<void> => {
    localStorage.removeItem('runa_auth_token');
    if (auth) {
      await fbSignOut(auth);
    } else {
      await mockAuth.signOut();
      window.dispatchEvent(new Event('mock-auth-change'));
    }
  },

  // Listen to Auth State Changes
  onAuthChange: (callback: (user: AuthUser | null) => void) => {
    if (auth) {
      return onAuthStateChanged(auth, async (user) => {
        if (user) {
          const role = user.email?.startsWith('admin') ? 'admin' : 'user';
          try {
            const token = await user.getIdToken();
            localStorage.setItem('runa_auth_token', token);
          } catch (e) {
            console.error('[!] Error al refrescar token:', e);
          }
          callback({
            uid: user.uid,
            email: user.email || '',
            name: user.displayName || user.email?.split('@')[0] || 'Usuario',
            role: role,
          });
        } else {
          localStorage.removeItem('runa_auth_token');
          callback(null);
        }
      });
    } else {
      // Mock Auth State listener
      const checkMockUser = () => {
        const user = mockAuth.getCurrentUser();
        callback(user);
      };
      
      checkMockUser();
      
      // Expose a custom event for mock auth changes
      const handleMockChange = () => {
        checkMockUser();
      };
      window.addEventListener('mock-auth-change', handleMockChange);
      
      return () => {
        window.removeEventListener('mock-auth-change', handleMockChange);
      };
    }
  },

  // Get auth token synchronously from localStorage
  getToken: (): string | null => {
    return localStorage.getItem('runa_auth_token');
  }
};

// Sincronizar el usuario con la base de datos de MongoDB a través del backend
async function syncUserWithBackend(token: string) {
  try {
    const API_URL = 'http://localhost:8000';
    await fetch(`${API_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.warn('[!] Advertencia: No se pudo sincronizar el usuario con el backend MongoDB:', error);
  }
}
