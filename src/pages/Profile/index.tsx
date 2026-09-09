import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import './styles.css';

export default function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState(user?.email || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [emailMessage, setEmailMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-empty">
            <div className="profile-empty-icon">🔐</div>

            <h2>Vous devez être connecté</h2>

            <p>
              Connectez-vous pour accéder à votre profil.
            </p>

            <button
              type="button"
              className="profile-primary-button"
              onClick={() => navigate('/login')}
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Modifier l'email
  |--------------------------------------------------------------------------
  */

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setEmailLoading(true);
    setEmailError('');
    setEmailMessage('');

    try {
      const response = await api.put('/profile', {
        email: email.trim(),
      });

      const updatedUser = response.data.user;

      setUser(updatedUser);

      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      );

      setEmailMessage('Votre adresse email a été mise à jour.');
    } catch (error: any) {
      console.error('Erreur modification email :', error);

      const message =
        error?.response?.data?.message ||
        'Impossible de modifier votre adresse email.';

      setEmailError(message);
    } finally {
      setEmailLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Modifier le mot de passe
  |--------------------------------------------------------------------------
  */

  async function handlePasswordSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setPasswordLoading(true);
    setPasswordError('');
    setPasswordMessage('');

    if (newPassword !== passwordConfirmation) {
      setPasswordError(
        'Les deux nouveaux mots de passe ne correspondent pas.'
      );

      setPasswordLoading(false);
      return;
    }

    try {
      await api.put('/profile', {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: passwordConfirmation,
      });

      setCurrentPassword('');
      setNewPassword('');
      setPasswordConfirmation('');

      setPasswordMessage(
        'Votre mot de passe a été modifié avec succès.'
      );
    } catch (error: any) {
      console.error(
        'Erreur modification mot de passe :',
        error
      );

      const message =
        error?.response?.data?.message ||
        'Impossible de modifier votre mot de passe.';

      setPasswordError(message);
    } finally {
      setPasswordLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Rôle
  |--------------------------------------------------------------------------
  */

  function getRoleLabel(role: string) {
    switch (role) {
      case 'buyer':
        return 'Acheteur';

      case 'producer':
        return 'Producteur';

      case 'admin':
        return 'Administrateur';

      default:
        return role;
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* HEADER */}
        <div className="profile-header">
          <div>
            <span className="profile-label">
              MON COMPTE
            </span>

            <h1>Mon profil</h1>

            <p>
              Consultez et gérez les informations de votre compte.
            </p>
          </div>
        </div>

        {/* INFORMATIONS PERSONNELLES */}
        <section className="profile-card">

          <div className="profile-card-header">
            <div className="profile-card-icon">
              👤
            </div>

            <div>
              <h2>Informations personnelles</h2>

              <p>
                Les informations associées à votre compte.
              </p>
            </div>
          </div>

          <div className="profile-info-grid">

            <div className="profile-info-item">
              <span className="profile-info-label">
                Prénom
              </span>

              <strong>
                {user.first_name}
              </strong>
            </div>

            <div className="profile-info-item">
              <span className="profile-info-label">
                Nom
              </span>

              <strong>
                {user.last_name}
              </strong>
            </div>

            <div className="profile-info-item">
              <span className="profile-info-label">
                Téléphone
              </span>

              <strong>
                {user.phone}
              </strong>
            </div>

            <div className="profile-info-item">
              <span className="profile-info-label">
                Rôle
              </span>

              <span className="profile-role">
                {getRoleLabel(user.role)}
              </span>
            </div>

            <div className="profile-info-item profile-info-full">
              <span className="profile-info-label">
                Adresse email
              </span>

              <strong>
                {user.email}
              </strong>
            </div>

          </div>
        </section>

        {/* MODIFICATION EMAIL */}
        <section className="profile-card">

          <div className="profile-card-header">
            <div className="profile-card-icon">
              ✉️
            </div>

            <div>
              <h2>Modifier mon email</h2>

              <p>
                Modifiez l'adresse email utilisée pour votre compte.
              </p>
            </div>
          </div>

          <form
            className="profile-form"
            onSubmit={handleEmailSubmit}
          >

            <div className="profile-form-group">
              <label htmlFor="email">
                Nouvelle adresse email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="exemple@email.com"
                required
              />
            </div>

            {emailError && (
              <div className="profile-message profile-message-error">
                ⚠️ {emailError}
              </div>
            )}

            {emailMessage && (
              <div className="profile-message profile-message-success">
                ✓ {emailMessage}
              </div>
            )}

            <button
              type="submit"
              className="profile-primary-button"
              disabled={emailLoading}
            >
              {emailLoading
                ? 'Mise à jour...'
                : 'Modifier mon email'}
            </button>

          </form>
        </section>

        {/* MODIFICATION MOT DE PASSE */}
        <section className="profile-card">

          <div className="profile-card-header">
            <div className="profile-card-icon">
              🔐
            </div>

            <div>
              <h2>Modifier mon mot de passe</h2>

              <p>
                Utilisez votre mot de passe actuel pour effectuer
                cette modification.
              </p>
            </div>
          </div>

          <form
            className="profile-form"
            onSubmit={handlePasswordSubmit}
          >

            <div className="profile-form-group">
              <label htmlFor="current_password">
                Mot de passe actuel
              </label>

              <input
                id="current_password"
                type="password"
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(event.target.value)
                }
                placeholder="Votre mot de passe actuel"
                required
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="new_password">
                Nouveau mot de passe
              </label>

              <input
                id="new_password"
                type="password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
                placeholder="Minimum 8 caractères"
                minLength={8}
                required
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="password_confirmation">
                Confirmer le nouveau mot de passe
              </label>

              <input
                id="password_confirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(event) =>
                  setPasswordConfirmation(event.target.value)
                }
                placeholder="Confirmez votre nouveau mot de passe"
                minLength={8}
                required
              />
            </div>

            {passwordError && (
              <div className="profile-message profile-message-error">
                ⚠️ {passwordError}
              </div>
            )}

            {passwordMessage && (
              <div className="profile-message profile-message-success">
                ✓ {passwordMessage}
              </div>
            )}

            <button
              type="submit"
              className="profile-primary-button"
              disabled={passwordLoading}
            >
              {passwordLoading
                ? 'Modification...'
                : 'Modifier mon mot de passe'}
            </button>

          </form>
        </section>

        {/* RETOUR */}
        <div className="profile-footer">
          <button
            type="button"
            className="profile-secondary-button"
            onClick={() => navigate('/')}
          >
            ← Retour à l'accueil
          </button>
        </div>

      </div>
    </div>
  );
}