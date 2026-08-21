import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import * as authService from '../services/authService';
import { extractApiError } from '../services/api';
import { STORAGE_KEYS } from '../utils/constants';

import type {
  LoginPayload,
  RegisterPayload,
  User,
} from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<
  AuthContextValue | undefined
>(undefined);

/**
 * Récupérer l'utilisateur sauvegardé localement
 */
function readStoredUser(): User | null {
  const raw = localStorage.getItem(STORAGE_KEYS.USER);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as User;
  } catch {
    localStorage.removeItem(STORAGE_KEYS.USER);
    return null;
  }
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [user, setUser] = useState<User | null>(
    readStoredUser
  );

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEYS.TOKEN)
  );

  /**
   * IMPORTANT :
   * Tant que nous n'avons pas vérifié le token avec /me,
   * l'application est en cours de restauration de session.
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Sauvegarder la session
   */
  const persistSession = useCallback(
    (nextUser: User, nextToken: string) => {

      localStorage.setItem(
        STORAGE_KEYS.TOKEN,
        nextToken
      );

      localStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify(nextUser)
      );

      setUser(nextUser);
      setToken(nextToken);
    },
    []
  );

  /**
   * Supprimer complètement la session
   */
  const clearSession = useCallback(() => {

    localStorage.removeItem(
      STORAGE_KEYS.TOKEN
    );

    localStorage.removeItem(
      STORAGE_KEYS.USER
    );

    setUser(null);
    setToken(null);

  }, []);

  /**
   * Restaurer la session au démarrage de l'application
   */
  useEffect(() => {

    const existingToken =
      localStorage.getItem(
        STORAGE_KEYS.TOKEN
      );

    /**
     * Aucun token sauvegardé
     */
    if (!existingToken) {
      setIsLoading(false);
      return;
    }

    /**
     * Token trouvé :
     * on vérifie qu'il est toujours valide
     * auprès de Laravel.
     */
    authService
      .getCurrentUser()

      .then((freshUser) => {

        setUser(freshUser);

        localStorage.setItem(
          STORAGE_KEYS.USER,
          JSON.stringify(freshUser)
        );

      })

      .catch((error) => {

        console.error(
          'Impossible de restaurer la session :',
          error
        );

        clearSession();

      })

      .finally(() => {

        setIsLoading(false);

      });

  }, [clearSession]);

  /**
   * Connexion
   */
  const login = useCallback(
    async (payload: LoginPayload) => {

      try {

        const response =
          await authService.login(payload);

        persistSession(
          response.user,
          response.token
        );

      } catch (error) {

        throw extractApiError(error);

      }

    },
    [persistSession]
  );

  /**
   * Inscription
   */
  const register = useCallback(
    async (payload: RegisterPayload) => {

      try {

        const response =
          await authService.register(payload);

        persistSession(
          response.user,
          response.token
        );

      } catch (error) {

        throw extractApiError(error);

      }

    },
    [persistSession]
  );

  /**
   * Déconnexion
   */
  const logout = useCallback(
    async () => {

      try {

        await authService.logout();

      } finally {

        clearSession();

      }

    },
    [clearSession]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,

      isAuthenticated:
        Boolean(user && token),

      isLoading,

      login,
      register,
      logout,
    }),
    [
      user,
      token,
      isLoading,
      login,
      register,
      logout,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}