
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '../utils/helpers';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const savedToken = getLocalStorage('authToken');
      const savedUser = getLocalStorage('user');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.data.success) {
        const { token: newToken, user: newUser } = response.data;

        setToken(newToken);
        setUser(newUser);
        setLocalStorage('authToken', newToken);
        setLocalStorage('user', newUser);

        return { success: true, user: newUser };
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed'
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    removeLocalStorage('authToken');
    removeLocalStorage('user');
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isClinic: user?.role === 'clinic',
    isProvider: user?.role === 'provider'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
