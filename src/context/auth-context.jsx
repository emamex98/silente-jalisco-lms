import { useNavigate } from 'react-router-dom';
import { SignOutUser, userStateListener } from '@libs/firebase/authentication';
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
  currentUser: {},
  setCurrentUser: () => {},
  signOut: () => {},
  isAuthLoading: false,
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: '',
    role: 'student',
    level: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = userStateListener((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    return unsubscribe;
  }, [setCurrentUser]);

  useEffect(() => {
    if (currentUser !== undefined) {
      setIsAuthLoading(false);
    }
  }, [currentUser]);

  // As soon as setting the current user to null,
  // the user will be redirected to the home page.
  const signOut = () => {
    SignOutUser();
    setCurrentUser(null);
    navigate('/');
  };

  const value = {
    currentUser,
    setCurrentUser,
    userData,
    setUserData,
    signOut,
    isAuthLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
