
import React, { createContext, useState, ReactNode, useContext } from 'react';


interface User {
  _id: string;
  username: string;
  email: string;
}


interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;  
}


const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

// 4. Export a context provider to wrap around the app
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Implement logout logic here
  const logout = () => {
    setUser(null);
    // You can add other logout side effects here, e.g. clearing tokens or localStorage
    localStorage.removeItem('token'); // example if you store token
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// 5. Export the context and a custom hook for cleaner access
export const useUser = () => useContext(UserContext);
export { UserContext };
