import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('TOKEN_APLICACAO_FRONTEND');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return { token };
};
