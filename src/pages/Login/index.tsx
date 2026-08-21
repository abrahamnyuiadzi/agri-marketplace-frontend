import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import type { ApiError } from '../../services/api';
import './styles.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si on a été redirigé ici depuis une page protégée (PrivateRoute),
  // on récupère l'URL d'origine pour y retourner après connexion.
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Connexion</h1>
        <p className="auth-subtitle">Accède à ton compte AgriMarket</p>

        {error && <div className="auth-error">{error}</div>}

        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="toi@exemple.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          type="password"
          name="password"
          label="Mot de passe"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" isLoading={isLoading}>
          Se connecter
        </Button>

        <p className="auth-footer">
          Pas encore de compte ? <Link to="/register">Inscris-toi</Link>
        </p>
      </form>
    </div>
  );
}