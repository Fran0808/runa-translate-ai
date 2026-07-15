export type MockUser = {
  uid: string;
  email: string;
  name: string;
  role: string;
};

// Simulate a local database of users in localStorage
const getMockUsers = (): MockUser[] => {
  const users = localStorage.getItem('mock_users');
  return users ? JSON.parse(users) : [];
};

const saveMockUsers = (users: MockUser[]) => {
  localStorage.setItem('mock_users', JSON.stringify(users));
};

export const mockAuth = {
  // Sign up a new user locally
  signUp: async (email: string, _password: string, name: string): Promise<MockUser> => {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network latency
    const users = getMockUsers();
    
    if (users.some((u) => u.email === email)) {
      throw new Error('El correo electrónico ya está registrado.');
    }

    const role = email.startsWith('admin') ? 'admin' : 'user';
    const newUser: MockUser = {
      uid: `mock-uid-${Math.random().toString(36).substr(2, 9)}`,
      email,
      name,
      role,
    };

    users.push(newUser);
    saveMockUsers(users);
    
    // Auto login
    localStorage.setItem('mock_current_user', JSON.stringify(newUser));
    const token = `${newUser.uid}||${newUser.email}||${newUser.name}`;
    localStorage.setItem('runa_auth_token', token);
    
    return newUser;
  },

  // Sign in an existing user locally
  signIn: async (email: string, _password: string): Promise<MockUser> => {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network latency
    const users = getMockUsers();
    
    // Check if user exists
    const user = users.find((u) => u.email === email);
    if (!user) {
      throw new Error('Correo electrónico o contraseña incorrectos.');
    }

    // In a mock environment we accept any password
    localStorage.setItem('mock_current_user', JSON.stringify(user));
    const token = `${user.uid}||${user.email}||${user.name}`;
    localStorage.setItem('runa_auth_token', token);
    
    return user;
  },

  // Log out current user
  signOut: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    localStorage.removeItem('mock_current_user');
    localStorage.removeItem('runa_auth_token');
  },

  // Get currently logged-in user
  getCurrentUser: (): MockUser | null => {
    const user = localStorage.getItem('mock_current_user');
    return user ? JSON.parse(user) : null;
  },

  // Check if token exists
  getToken: (): string | null => {
    return localStorage.getItem('runa_auth_token');
  }
};
