import React, { createContext, useContext, useState } from 'react';

const AuthGateContext = createContext(null);

export function AuthGateProvider({ children }) {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <AuthGateContext.Provider
      value={{
        unlocked,
        unlock: () => setUnlocked(true),
        lock: () => setUnlocked(false),
      }}
    >
      {children}
    </AuthGateContext.Provider>
  );
}

export const useAuthGate = () => useContext(AuthGateContext);
