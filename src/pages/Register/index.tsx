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

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setError(null);
    setFieldErrors({});

    // Vérification des termes et conditions
    if (!termsAccepted) {
      setError(
        'Tu dois accepter les termes et conditions avant de créer ton compte.'
      );
      return;
    }

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
        terms_accepted: true,
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

        <p className="auth-subtitle">
          Rejoins AgriMarket en quelques secondes
        </p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

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
          error={fieldErrors.password_confirmation?.[0]}
          required
        />

        <div className="role-group">

          <span className="input-label">
            Je suis
          </span>

          <div className="role-options">

            <label
              className={`role-option ${
                role === 'buyer' ? 'role-option--active' : ''
              }`}
            >
              <input
                type="radio"
                name="role"
                value="buyer"
                checked={role === 'buyer'}
                onChange={() => setRole('buyer')}
              />

              Acheteur
            </label>

            <label
              className={`role-option ${
                role === 'producer' ? 'role-option--active' : ''
              }`}
            >
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

        {/* Termes et conditions */}
        <div className="terms-group">

          <label className="terms-checkbox">

            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />

            <span>
              J'accepte les{' '}
              <button
                type="button"
                className="terms-link"
                onClick={() => setShowTerms(true)}
              >
                termes et conditions
              </button>
              {' '}d'utilisation d'AgriMarket.
            </span>

          </label>

        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          disabled={!termsAccepted}
        >
          Créer mon compte
        </Button>

        <p className="auth-footer">
          Déjà un compte ?{' '}
          <Link to="/login">
            Connecte-toi
          </Link>
        </p>

      </form>

      {/* MODAL TERMES ET CONDITIONS */}
      {showTerms && (
        <div
          className="terms-modal-overlay"
          onClick={() => setShowTerms(false)}
        >

          <div
            className="terms-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="terms-modal__header">

              <h2>
                Termes et conditions
              </h2>

              <button
                type="button"
                className="terms-modal__close"
                onClick={() => setShowTerms(false)}
              >
                ×
              </button>

            </div>

            <div className="terms-modal__content">

              <h3>1. Acceptation des conditions</h3>

              <p>
                En créant un compte sur AgriMarket, vous reconnaissez
                avoir lu, compris et accepté les présents termes et
                conditions d'utilisation de la plateforme.
              </p>

              <h3>2. Utilisation de la plateforme</h3>

              <p>
                AgriMarket est une plateforme destinée à mettre en
                relation les producteurs agricoles et les acheteurs.
                Chaque utilisateur s'engage à fournir des informations
                exactes lors de son inscription.
              </p>

              <h3>3. Compte utilisateur</h3>

              <p>
                Vous êtes responsable de la confidentialité de vos
                informations de connexion et de toutes les activités
                effectuées depuis votre compte.
              </p>

              <h3>4. Producteurs</h3>

              <p>
                Les producteurs sont responsables de l'exactitude des
                informations concernant leurs produits, leurs prix,
                leurs quantités et leurs exploitations.
              </p>

              <h3>5. Acheteurs</h3>

              <p>
                Les acheteurs s'engagent à fournir des informations
                exactes et à utiliser la plateforme conformément à
                son objectif.
              </p>

              <h3>6. Produits et transactions</h3>

              <p>
                AgriMarket facilite la mise en relation entre
                producteurs et acheteurs. Les utilisateurs doivent
                respecter les règles applicables aux produits et
                transactions effectuées sur la plateforme.
              </p>

              <h3>7. Respect des utilisateurs</h3>

              <p>
                Tout comportement frauduleux, abusif ou contraire
                aux lois en vigueur peut entraîner la suspension
                ou la suppression du compte.
              </p>

              <h3>8. Modification des conditions</h3>

              <p>
                AgriMarket peut modifier les présents termes et
                conditions lorsque cela est nécessaire. Les
                utilisateurs seront informés des changements
                importants.
              </p>

              <h3>9. Acceptation</h3>

              <p>
                En cochant la case « J'accepte les termes et
                conditions », vous confirmez votre accord avec
                l'ensemble des conditions présentées ci-dessus.
              </p>

            </div>

            <div className="terms-modal__footer">

              <button
                type="button"
                className="terms-modal__accept"
                onClick={() => {
                  setTermsAccepted(true);
                  setShowTerms(false);
                }}
              >
                J'ai lu et j'accepte
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}