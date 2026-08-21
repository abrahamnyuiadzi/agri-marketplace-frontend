import { Link } from 'react-router-dom';
import './styles.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <span className="footer__logo">🌾 Agri Marketplace</span>

          <div className="footer__app">
            <p className="footer__app-title">Téléchargez notre application</p>
            <p className="footer__app-subtitle">Disponible sur Android et iOS</p>

            <div className="footer__app-badges">
              <a href="#" className="store-badge">
                <span className="store-badge__icon">▶</span>
                <span className="store-badge__text">
                  <small>Disponible sur</small>
                  <strong>Google Play</strong>
                </span>
              </a>
              <a href="#" className="store-badge">
                <span className="store-badge__icon"></span>
                <span className="store-badge__text">
                  <small>Télécharger dans l'</small>
                  <strong>App Store</strong>
                </span>
              </a>
            </div>
          </div>

          <div className="footer__phone-mockup" aria-hidden="true">
            <div className="footer__phone-screen" />
          </div>
        </div>

        <div className="footer__column">
          <h4>Liens utiles</h4>
          <Link to="/">Accueil</Link>
          <Link to="/products">Produits</Link>
          <Link to="/categories">Catégories</Link>
          <Link to="/farms">Exploitations</Link>
        </div>

        <div className="footer__column">
          <h4>Mon compte</h4>
          <Link to="/login">Connexion</Link>
          <Link to="/register">Inscription</Link>
          <Link to="/profile">Mes commandes</Link>
          <Link to="/profile">Mes favoris</Link>
        </div>

        <div className="footer__column">
          <h4>Contactez-nous</h4>
          <a href="tel:+22890000000">📞 +228 90 00 00 00</a>
          <a href="mailto:contact@agrimarket.tg">✉️ contact@agrimarket.tg</a>
          <span>📍 Lomé, Togo</span>
          <div className="footer__socials">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="WhatsApp">💬</a>
            <a href="#" aria-label="Instagram">📷</a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} Agri Marketplace — Tous droits réservés</p>
        <div className="footer__legal">
          <Link to="/terms">Conditions d'utilisation</Link>
          <Link to="/privacy">Politique de confidentialité</Link>
        </div>
      </div>
    </footer>
  );
}