import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import type { ApiError } from '../../services/api';
import type { UserRole } from '../../types';
import './styles.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsLoading(true);

    try {
      await register({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        password,
        password_confirmation: passwordConfirmation,
        role,
      });
      navigate('/', { replace: true });
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      if (apiError.errors) {
        setFieldErrors(apiError.errors);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Créer un compte</h1>
        <p className="auth-subtitle">Rejoins AgriMarket en quelques secondes</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="name-row">
          <Input
            type="text"
            name="first_name"
            label="Prénom"
            placeholder="Ton prénom"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={fieldErrors.first_name?.[0]}
            required
          />

          <Input
            type="text"
            name="last_name"
            label="Nom"
            placeholder="Ton nom"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={fieldErrors.last_name?.[0]}
            required
          />
        </div>

        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="toi@exemple.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email?.[0]}
          required
        />

        <Input
          type="tel"
          name="phone"
          label="Téléphone"
          placeholder="+228 90 00 00 00"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={fieldErrors.phone?.[0]}
          required
        />

        <Input
          type="password"
          name="password"
          label="Mot de passe"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password?.[0]}
          required
        />

        <Input
          type="password"
          name="password_confirmation"
          label="Confirme le mot de passe"
          placeholder="••••••••"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />

        <div className="role-group">
          <span className="input-label">Je suis</span>
          <div className="role-options">
            <label className={`role-option ${role === 'buyer' ? 'role-option--active' : ''}`}>
              <input
                type="radio"
                name="role"
                value="buyer"
                checked={role === 'buyer'}
                onChange={() => setRole('buyer')}
              />
              Acheteur
            </label>
            <label className={`role-option ${role === 'producer' ? 'role-option--active' : ''}`}>
              <input
                type="radio"
                name="role"
                value="producer"
                checked={role === 'producer'}
                onChange={() => setRole('producer')}
              />
              Producteur
            </label>
          </div>
        </div>

        <Button type="submit" isLoading={isLoading}>
          Créer mon compte
        </Button>

        <p className="auth-footer">
          Déjà un compte ? <Link to="/login">Connecte-toi</Link>
        </p>
      </form>
    </div>
  );
}