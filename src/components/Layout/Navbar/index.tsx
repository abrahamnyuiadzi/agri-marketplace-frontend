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
    await logout();
    navigate('/login');
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar__logo">
        🌾 Agri Marketplace
      </Link>

      <nav className="navbar__links">
        <Link to="/products">Produits</Link>
        <Link to="/categories">Catégories</Link>
        <Link to="/farms">Exploitations</Link>
        <Link to="/cart" className="navbar__cart">
          Panier {itemCount > 0 && <span className="navbar__badge">{itemCount}</span>}
        </Link>

        {isAuthenticated ? (
          <>
            {user?.role === 'producer' && <Link to="/producer/dashboard">Mon espace</Link>}
            {user?.role === 'admin' && <Link to="/admin/dashboard">Administration</Link>}
            <Link to="/profile">{user && getFullName(user)}</Link>
            <button className="navbar__logout" onClick={handleLogout}>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Inscription</Link>
          </>
        )}
      </nav>
    </header>
  );
}