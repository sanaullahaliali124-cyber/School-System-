import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { getData, saveData, STORAGE_KEYS, checkPermission, initializeStorageIfEmpty } from '../services/storage';
import { initialUsers } from '../data/initialData';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string, designatedRole?: UserRole) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  hasAccess: (module: any) => boolean;
  canManage: (module: any) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    initializeStorageIfEmpty();
    const storedUser = getData<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (storedUser) {
      setCurrentUser(storedUser);
    } else {
      // By default, log in as Admin for instant rich exploration
      const defaultAdmin = initialUsers[0];
      setCurrentUser(defaultAdmin);
      saveData(STORAGE_KEYS.CURRENT_USER, defaultAdmin);
    }
  }, []);

  const login = (email: string, _password?: string, designatedRole?: UserRole): boolean => {
    const users = getData<User[]>(STORAGE_KEYS.USERS, initialUsers);
    let matched = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!matched && designatedRole) {
      matched = users.find((u) => u.role === designatedRole);
    }

    if (matched) {
      const updatedUser = {
        ...matched,
        lastLogin: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setCurrentUser(updatedUser);
      saveData(STORAGE_KEYS.CURRENT_USER, updatedUser);
      return true;
    }

    // Fallback match by role name in email (e.g. admin, principal, etc.)
    const roleMatch = users.find((u) => email.toLowerCase().includes(u.role));
    if (roleMatch) {
      setCurrentUser(roleMatch);
      saveData(STORAGE_KEYS.CURRENT_USER, roleMatch);
      return true;
    }

    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  };

  const switchRole = (role: UserRole) => {
    const users = getData<User[]>(STORAGE_KEYS.USERS, initialUsers);
    const targetUser = users.find((u) => u.role === role) || {
      ...initialUsers[0],
      role,
      name: `${role.toUpperCase()} User`,
    };
    setCurrentUser(targetUser);
    saveData(STORAGE_KEYS.CURRENT_USER, targetUser);
  };

  const hasAccess = (module: any): boolean => {
    if (!currentUser) return false;
    const perm = checkPermission(currentUser.role, module);
    return perm !== 'none';
  };

  const canManage = (module: any): boolean => {
    if (!currentUser) return false;
    const perm = checkPermission(currentUser.role, module);
    return perm === 'full' || perm === 'manage';
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        switchRole,
        hasAccess,
        canManage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
