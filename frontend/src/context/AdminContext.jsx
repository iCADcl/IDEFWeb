import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AdminContext = createContext();

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmin(response.data);
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/admin/auth/login`, {
        username,
        password
      });
      
      const { access_token } = response.data;
      localStorage.setItem('admin_token', access_token);
      setToken(access_token);
      
      // Get admin info
      const adminResponse = await axios.get(`${BACKEND_URL}/api/admin/auth/me`, {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      setAdmin(adminResponse.data);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setAdmin(null);
  };

  const getAuthHeader = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        token,
        loading,
        login,
        logout,
        getAuthHeader,
        isAuthenticated: !!admin
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
