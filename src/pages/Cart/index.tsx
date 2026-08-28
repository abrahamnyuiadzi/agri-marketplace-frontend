
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import './styles.css';

export default function Cart() {
  const {
    items,
    total,
    itemCount,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  /**
   * Formater les prix en FCFA
   */
  function formatPrice(price: number) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0,
    }).format(price);
  }

  /**
   * Calcul du sous-total d'un produit
   */
  function getItemTotal(price: number, quantity: number) {
    return price * quantity;
  }

  /**
   * Aller vers la page de commande
   */
  function handleCheckout() {
    if (items.length === 0) {
      return;
    }

    navigate('/checkout');
  }

  return (
    <div className="cart-page">
      {/* =========================
          HEADER
      ========================== */}
      <div className="cart-page__header">
        <div>
          <span className="cart-page__badge">🛒 Votre panier</span>

          <h1>Mon panier</h1>

          <p>
            Vérifiez vos produits avant de passer votre commande.
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            className="cart-page__clear"
            onClick={clearCart}
          >
            Vider le panier
          </button>
        )}
      </div>

      {/* =========================
          PANIER VIDE
      ========================== */}
      {items.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty__icon">🛒</div>

          <h2>Votre panier est vide</h2>

          <p>
            Vous n'avez encore ajouté aucun produit à votre panier.
          </p>

          <Link to="/products" className="cart-empty__button">
            Découvrir les produits →
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* =========================
              LISTE DES PRODUITS
          ========================== */}
          <div className="cart-products">
            <div className="cart-products__top">
              <h2>
                Produits sélectionnés
              </h2>

              <span>
                {itemCount}{' '}
                {itemCount > 1 ? 'articles' : 'article'}
              </span>
            </div>

            <div className="cart-products__list">
              {items.map((item) => {
                const product = item.product;
                const itemTotal = getItemTotal(
                  product.price,
                  item.quantity
                );

                return (
                  <div
                    key={product.id}
                    className="cart-item"
                  >
                    {/* Image */}
                    <Link
                      to={`/products/${product.id}`}
                      className="cart-item__image"
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                        />
                      ) : (
                        <div className="cart-item__placeholder">
                          🌱
                        </div>
                      )}
                    </Link>

                    {/* Informations */}
                    <div className="cart-item__info">
                      <Link
                        to={`/products/${product.id}`}
                        className="cart-item__name"
                      >
                        {product.name}
                      </Link>

                      {product.farm && (
                        <p className="cart-item__farm">
                          🌾 {product.farm.name}
                        </p>
                      )}

                      {product.category && (
                        <span className="cart-item__category">
                          {product.category.name}
                        </span>
                      )}

                      <div className="cart-item__price">
                        {formatPrice(product.price)}
                        <span>
                          / {product.unit}
                        </span>
                      </div>

                      {/* Quantité */}
                      <div className="cart-item__quantity">
                        <span>Quantité</span>

                        <div className="quantity-control">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                product.id,
                                item.quantity - 1
                              )
                            }
                            aria-label="Diminuer la quantité"
                          >
                            −
                          </button>

                          <span>
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                product.id,
                                item.quantity + 1
                              )
                            }
                            aria-label="Augmenter la quantité"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Total + suppression */}
                    <div className="cart-item__right">
                      <strong>
                        {formatPrice(itemTotal)}
                      </strong>

                      <button
                        type="button"
                        className="cart-item__remove"
                        onClick={() =>
                          removeItem(product.id)
                        }
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Continuer les achats */}
            <Link
              to="/products"
              className="cart-continue"
            >
              ← Continuer mes achats
            </Link>
          </div>

          {/* =========================
              RÉSUMÉ
          ========================== */}
          <aside className="cart-summary">
            <h2>Résumé de la commande</h2>

            <div className="cart-summary__line">
              <span>
                Sous-total
              </span>

              <strong>
                {formatPrice(total)}
              </strong>
            </div>

            <div className="cart-summary__line">
              <span>
                Livraison
              </span>

              <strong>
                Gratuit
              </strong>
            </div>

            <div className="cart-summary__separator" />

            <div className="cart-summary__total">
              <span>
                Total
              </span>

              <strong>
                {formatPrice(total)}
              </strong>
            </div>

            <button
              type="button"
              className="cart-summary__checkout"
              onClick={handleCheckout}
            >
              Commander →
            </button>

            <div className="cart-summary__secure">
              <span>🔒</span>

              <p>
                Vos informations sont protégées.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

