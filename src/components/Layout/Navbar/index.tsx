import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { getFullName } from '../../../utils/helpers';
import { useCart } from '../../../hooks/useCart';
import './styles.css';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  }

  return (
    <header className="navbar">
      {/* Logo */}
      <Link to="/" className="navbar__logo">
        🌾 Agri Marketplace
      </Link>

      <nav className="navbar__links">

        {/* PANIER */}
        <Link
          to="/cart"
          className="navbar__cart"
          aria-label={`Panier${itemCount > 0 ? `, ${itemCount} article(s)` : ''}`}
          title="Panier"
        >
          <span className="navbar__cart-icon">🛒</span>

          {itemCount > 0 && (
            <span className="navbar__badge">
              {itemCount}
            </span>
          )}
        </Link>

        {isAuthenticated ? (
          <>
            {/* ESPACE PRODUCTEUR */}
            {user?.role === 'producer' && (
              <Link
                to="/producer/dashboard"
                className="navbar__space"
              >
                Espace producteur
              </Link>
            )}

            {/* ESPACE ADMIN */}
            {user?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className="navbar__space"
              >
                Administration
              </Link>
            )}

            {/* PROFIL */}
            <Link
              to="/profile"
              className="navbar__profile"
            >
              {user ? getFullName(user) : 'Mon profil'}
            </Link>

            {/* DÉCONNEXION */}
            <button
              type="button"
              className="navbar__logout"
              onClick={handleLogout}
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            {/* UTILISATEUR NON CONNECTÉ */}
            <Link
              to="/login"
              className="navbar__login"
            >
              Connexion
            </Link>

            <Link
              to="/register"
              className="navbar__register"
            >
              Inscription
            </Link>
          </>
        )}

      </nav>
    </header>
  );
}