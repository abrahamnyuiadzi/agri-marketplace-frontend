
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/helpers';
import './styles.css';

type PaymentMethod = 'flooz' | 'tmoney' | '';

interface BuyerForm {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  neighborhood: string;
  note: string;
}

export default function Checkout() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('');

  const [form, setForm] = useState<BuyerForm>({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    neighborhood: '',
    note: '',
  });

  const [isConfirmed, setIsConfirmed] = useState(false);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function increment(productId: number, currentQuantity: number) {
    updateQuantity(productId, currentQuantity + 1);
  }

  function decrement(productId: number, currentQuantity: number) {
    if (currentQuantity <= 1) {
      removeItem(productId);
      return;
    }

    updateQuantity(productId, currentQuantity - 1);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!paymentMethod) {
      alert('Veuillez sélectionner un moyen de paiement.');
      return;
    }

    setIsConfirmed(true);
  }

  if (items.length === 0 && !isConfirmed) {
    return (
      <div className="checkout">
        <div className="checkout__empty">
          <div className="checkout__empty-icon">🛒</div>

          <h1>Votre panier est vide</h1>

          <p>
            Ajoutez des produits agricoles à votre panier
            avant de passer commande.
          </p>

          <Link
            to="/products"
            className="checkout__btn checkout__btn--primary"
          >
            Découvrir les produits →
          </Link>
        </div>
      </div>
    );
  }

  if (isConfirmed) {
    return (
      <div className="checkout">
        <div className="checkout__success">

          <div className="checkout__success-icon">
            ✓
          </div>

          <h1>Commande prête à être confirmée</h1>

          <p>
            Merci {form.first_name} {form.last_name}.
          </p>

          <p>
            Votre commande est de :
          </p>

          <strong className="checkout__success-total">
            {formatPrice(total)}
          </strong>

          <div className="payment-instruction">
            <h2>
              Paiement par{' '}
              {paymentMethod === 'flooz'
                ? 'Flooz'
                : 'TMoney'}
            </h2>

            <p>
              Veuillez envoyer le montant exact de votre
              commande au numéro suivant :
            </p>

            <strong className="payment-instruction__number">
              {paymentMethod === 'flooz'
                ? 'XX XX XX XX'
                : 'XX XX XX XX'}
            </strong>

            <p className="payment-instruction__warning">
              ⚠️ Pour le moment, le paiement est manuel.
              Vérifiez bien le numéro avant d'envoyer
              l'argent.
            </p>
          </div>

          <div className="checkout__success-actions">
            <button
              className="checkout__btn checkout__btn--primary"
              onClick={() => {
                clearCart();
                navigate('/');
              }}
            >
              J'ai effectué le paiement
            </button>

            <button
              className="checkout__btn checkout__btn--secondary"
              onClick={() => setIsConfirmed(false)}
            >
              Modifier ma commande
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="checkout">

      <div className="checkout__header">
        <div>
          <Link to="/cart" className="checkout__back">
            ← Retour au panier
          </Link>

          <h1>Finaliser votre commande</h1>

          <p>
            Remplissez vos informations pour recevoir
            votre commande.
          </p>
        </div>
      </div>

      <div className="checkout__layout">

        {/* =========================
            INFORMATIONS ACHETEUR
        ========================== */}

        <form
          className="checkout__form"
          onSubmit={handleSubmit}
        >

          <section className="checkout__section">

            <div className="checkout__section-header">
              <span>1</span>

              <div>
                <h2>Informations de l'acheteur</h2>
                <p>
                  Vous pouvez commander sans créer de compte.
                </p>
              </div>
            </div>

            <div className="checkout__grid">

              <div className="checkout__field">
                <label htmlFor="first_name">
                  Prénom *
                </label>

                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="Votre prénom"
                  required
                />
              </div>

              <div className="checkout__field">
                <label htmlFor="last_name">
                  Nom *
                </label>

                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  required
                />
              </div>

              <div className="checkout__field">
                <label htmlFor="phone">
                  Téléphone *
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Ex : 90 00 00 00"
                  required
                />
              </div>

              <div className="checkout__field">
                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="exemple@email.com"
                />
              </div>

            </div>

          </section>

          {/* =========================
              LIVRAISON
          ========================== */}

          <section className="checkout__section">

            <div className="checkout__section-header">
              <span>2</span>

              <div>
                <h2>Informations de livraison</h2>
                <p>
                  Indiquez où nous devons livrer votre commande.
                </p>
              </div>
            </div>

            <div className="checkout__field">
              <label htmlFor="address">
                Adresse *
              </label>

              <input
                id="address"
                name="address"
                type="text"
                value={form.address}
                onChange={handleChange}
                placeholder="Ex : Rue 123, maison 45"
                required
              />
            </div>

            <div className="checkout__grid">

              <div className="checkout__field">
                <label htmlFor="city">
                  Ville *
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Ex : Lomé"
                  required
                />
              </div>

              <div className="checkout__field">
                <label htmlFor="neighborhood">
                  Quartier *
                </label>

                <input
                  id="neighborhood"
                  name="neighborhood"
                  type="text"
                  value={form.neighborhood}
                  onChange={handleChange}
                  placeholder="Ex : Agoè"
                  required
                />
              </div>

            </div>

            <div className="checkout__field">

              <label htmlFor="note">
                Instructions de livraison
              </label>

              <textarea
                id="note"
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Une indication pour faciliter la livraison..."
                rows={4}
              />

            </div>

          </section>

          {/* =========================
              PAIEMENT
          ========================== */}

          <section className="checkout__section">

            <div className="checkout__section-header">
              <span>3</span>

              <div>
                <h2>Mode de paiement</h2>
                <p>
                  Choisissez votre moyen de paiement.
                </p>
              </div>
            </div>

            <div className="payment-methods">

              <button
                type="button"
                className={`payment-method ${
                  paymentMethod === 'flooz'
                    ? 'payment-method--active'
                    : ''
                }`}
                onClick={() => setPaymentMethod('flooz')}
              >
                <span className="payment-method__icon">
                  💳
                </span>

                <span>
                  <strong>Flooz</strong>
                  <small>
                    Paiement mobile
                  </small>
                </span>

                <span className="payment-method__radio">
                  {paymentMethod === 'flooz' ? '✓' : ''}
                </span>
              </button>

              <button
                type="button"
                className={`payment-method ${
                  paymentMethod === 'tmoney'
                    ? 'payment-method--active'
                    : ''
                }`}
                onClick={() => setPaymentMethod('tmoney')}
              >
                <span className="payment-method__icon">
                  📱
                </span>

                <span>
                  <strong>TMoney</strong>
                  <small>
                    Paiement mobile
                  </small>
                </span>

                <span className="payment-method__radio">
                  {paymentMethod === 'tmoney' ? '✓' : ''}
                </span>
              </button>

            </div>

          </section>

          <button
            type="submit"
            className="checkout__submit"
          >
            Confirmer la commande →
          </button>

        </form>

        {/* =========================
            RÉSUMÉ
        ========================== */}

        <aside className="checkout__summary">

          <h2>Votre commande</h2>

          <div className="checkout__items">

            {items.map((item) => (

              <div
                className="checkout__item"
                key={item.product.id}
              >

                <div className="checkout__item-image">

                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                    />
                  ) : (
                    <span>🥬</span>
                  )}

                </div>

                <div className="checkout__item-info">

                  <h3>
                    {item.product.name}
                  </h3>

                  <span>
                    {formatPrice(item.product.price)}
                    {' / '}
                    {item.product.unit}
                  </span>

                  <div className="checkout__quantity">

                    <button
                      type="button"
                      onClick={() =>
                        decrement(
                          item.product.id,
                          item.quantity
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        increment(
                          item.product.id,
                          item.quantity
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                </div>

                <strong>
                  {formatPrice(
                    item.product.price *
                    item.quantity
                  )}
                </strong>

              </div>

            ))}

          </div>

          <div className="checkout__summary-total">

            <span>Total</span>

            <strong>
              {formatPrice(total)}
            </strong>

          </div>

        </aside>

      </div>

    </div>
  );
}

