import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useCart } from '../../hooks/useCart';
import { createOrder } from '../../services/orderService';
import { formatPrice } from '../../utils/helpers';

import './styles.css';

type PaymentMethod = 'flooz' | 'tmoney';

export default function Checkout() {
  const navigate = useNavigate();

  const {
    items,
    total,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [note, setNote] = useState('');

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('flooz');

  const [paymentPhone, setPaymentPhone] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  /*
  |--------------------------------------------------------------------------
  | Numéros de paiement
  |--------------------------------------------------------------------------
  |
  | Pour le moment ce sont des numéros d'exemple.
  | Tu pourras les remplacer par les vrais numéros de ton entreprise.
  |
  */

  const paymentNumbers = {
    flooz: '90 00 00 00',
    tmoney: '91 00 00 00',
  };

  /*
  |--------------------------------------------------------------------------
  | Si le panier est vide
  |--------------------------------------------------------------------------
  */

  if (items.length === 0 && !successMessage) {
    return (
      <div className="checkout">
        <div className="checkout__empty">
          <div className="checkout__empty-icon">🛒</div>

          <h1>Votre panier est vide</h1>

          <p>
            Vous devez ajouter au moins un produit avant de
            pouvoir passer une commande.
          </p>

          <Link
            to="/products"
            className="checkout__button checkout__button--primary"
          >
            Découvrir les produits
          </Link>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Modifier la quantité
  |--------------------------------------------------------------------------
  */

  function increaseQuantity(
    productId: number,
    currentQuantity: number,
    availableQuantity: number
  ) {
    if (currentQuantity >= availableQuantity) {
      return;
    }

    updateQuantity(productId, currentQuantity + 1);
  }

  function decreaseQuantity(
    productId: number,
    currentQuantity: number
  ) {
    if (currentQuantity <= 1) {
      removeItem(productId);
      return;
    }

    updateQuantity(productId, currentQuantity - 1);
  }

  /*
  |--------------------------------------------------------------------------
  | Soumission de la commande
  |--------------------------------------------------------------------------
  */

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');

    /*
    |--------------------------------------------------------------------------
    | Vérifier le panier
    |--------------------------------------------------------------------------
    */

    if (items.length === 0) {
      setErrorMessage(
        'Votre panier est vide.'
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Vérification frontend
    |--------------------------------------------------------------------------
    */

    if (!firstName.trim()) {
      setErrorMessage(
        'Veuillez saisir votre prénom.'
      );

      return;
    }

    if (!lastName.trim()) {
      setErrorMessage(
        'Veuillez saisir votre nom.'
      );

      return;
    }

    if (!phone.trim()) {
      setErrorMessage(
        'Veuillez saisir votre numéro de téléphone.'
      );

      return;
    }

    if (!address.trim()) {
      setErrorMessage(
        'Veuillez saisir votre adresse.'
      );

      return;
    }

    if (!city.trim()) {
      setErrorMessage(
        'Veuillez saisir votre ville.'
      );

      return;
    }

    if (!paymentPhone.trim()) {
      setErrorMessage(
        'Veuillez saisir le numéro utilisé pour le paiement.'
      );

      return;
    }

    setIsSubmitting(true);

    try {
      /*
      |--------------------------------------------------------------------------
      | Préparer les produits
      |--------------------------------------------------------------------------
      */

      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }));

      /*
      |--------------------------------------------------------------------------
      | Envoyer la commande au backend
      |--------------------------------------------------------------------------
      */

      const order = await createOrder({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,

        address: address.trim(),
        city: city.trim(),
        neighborhood:
          neighborhood.trim() || undefined,
        note: note.trim() || undefined,

        payment_method: paymentMethod,
        payment_phone: paymentPhone.trim(),

        items: orderItems,
      });

      console.log(
        'Commande créée :',
        order
      );

      /*
      |--------------------------------------------------------------------------
      | Vider le panier
      |--------------------------------------------------------------------------
      */

      clearCart();

      /*
      |--------------------------------------------------------------------------
      | Afficher le message de succès
      |--------------------------------------------------------------------------
      */

      setSuccessMessage(
        'Votre commande a été reçue avec succès !'
      );

    } catch (error: any) {

      console.error(
        'Erreur lors de la commande :',
        error
      );

      /*
      |--------------------------------------------------------------------------
      | Récupérer le message Laravel
      |--------------------------------------------------------------------------
      */

      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Une erreur est survenue lors de la commande.';

      setErrorMessage(message);

    } finally {

      setIsSubmitting(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Page de confirmation
  |--------------------------------------------------------------------------
  */

  if (successMessage) {
    return (
      <div className="checkout">
        <div className="checkout__success">

          <div className="checkout__success-icon">
            ✓
          </div>

          <h1>
            Commande reçue !
          </h1>

          <p>
            {successMessage}
          </p>

          <p className="checkout__success-info">
            Nous avons bien enregistré votre commande.
            Notre équipe vous contactera prochainement
            pour confirmer la commande et la livraison.
          </p>

          <div className="checkout__success-actions">

            <Link
              to="/products"
              className="checkout__button checkout__button--primary"
            >
              Continuer mes achats
            </Link>

            <Link
              to="/"
              className="checkout__button checkout__button--secondary"
            >
              Retour à l'accueil
            </Link>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="checkout">

      {/* =====================================================
          EN-TÊTE
      ====================================================== */}

      <div className="checkout__header">

        <div>
          <span className="checkout__badge">
            🌱 Agro Marketplace
          </span>

          <h1>
            Finaliser votre commande
          </h1>

          <p>
            Renseignez vos informations pour recevoir
            votre commande.
          </p>
        </div>

        <Link
          to="/cart"
          className="checkout__back"
        >
          ← Retour au panier
        </Link>

      </div>


      {/* =====================================================
          ERREUR
      ====================================================== */}

      {errorMessage && (
        <div className="checkout__alert checkout__alert--error">
          <span>⚠️</span>

          <p>
            {errorMessage}
          </p>
        </div>
      )}


      <div className="checkout__layout">

        {/* ===================================================
            FORMULAIRE
        ==================================================== */}

        <form
          className="checkout__form"
          onSubmit={handleSubmit}
        >

          {/* =================================================
              INFORMATIONS ACHETEUR
          ================================================== */}

          <section className="checkout__card">

            <div className="checkout__card-header">
              <span className="checkout__step">
                1
              </span>

              <div>
                <h2>
                  Informations de l'acheteur
                </h2>

                <p>
                  Ces informations nous permettront de vous
                  contacter.
                </p>
              </div>
            </div>


            <div className="checkout__fields">

              <div className="checkout__field">

                <label htmlFor="first_name">
                  Prénom *
                </label>

                <input
                  id="first_name"
                  type="text"
                  value={firstName}
                  onChange={(e) =>
                    setFirstName(e.target.value)
                  }
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
                  type="text"
                  value={lastName}
                  onChange={(e) =>
                    setLastName(e.target.value)
                  }
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
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
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
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="exemple@email.com"
                />

              </div>

            </div>

          </section>


          {/* =================================================
              LIVRAISON
          ================================================== */}

          <section className="checkout__card">

            <div className="checkout__card-header">

              <span className="checkout__step">
                2
              </span>

              <div>

                <h2>
                  Adresse de livraison
                </h2>

                <p>
                  Où devons-nous livrer votre commande ?
                </p>

              </div>

            </div>


            <div className="checkout__fields">

              <div className="checkout__field checkout__field--full">

                <label htmlFor="address">
                  Adresse *
                </label>

                <textarea
                  id="address"
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  placeholder="Ex : Rue 123, près de..."
                  rows={3}
                  required
                />

              </div>


              <div className="checkout__field">

                <label htmlFor="city">
                  Ville *
                </label>

                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                  placeholder="Ex : Lomé"
                  required
                />

              </div>


              <div className="checkout__field">

                <label htmlFor="neighborhood">
                  Quartier
                </label>

                <input
                  id="neighborhood"
                  type="text"
                  value={neighborhood}
                  onChange={(e) =>
                    setNeighborhood(e.target.value)
                  }
                  placeholder="Ex : Agoè"
                />

              </div>


              <div className="checkout__field checkout__field--full">

                <label htmlFor="note">
                  Note pour la livraison
                </label>

                <textarea
                  id="note"
                  value={note}
                  onChange={(e) =>
                    setNote(e.target.value)
                  }
                  placeholder="Une indication supplémentaire..."
                  rows={3}
                />

              </div>

            </div>

          </section>


          {/* =================================================
              PAIEMENT
          ================================================== */}

          <section className="checkout__card">

            <div className="checkout__card-header">

              <span className="checkout__step">
                3
              </span>

              <div>

                <h2>
                  Paiement
                </h2>

                <p>
                  Pour le moment, le paiement se fait
                  manuellement par Mobile Money.
                </p>

              </div>

            </div>


            {/* Choix du moyen de paiement */}

            <div className="payment-methods">

              <button
                type="button"
                className={`payment-method ${
                  paymentMethod === 'flooz'
                    ? 'payment-method--active'
                    : ''
                }`}
                onClick={() =>
                  setPaymentMethod('flooz')
                }
              >

                <span className="payment-method__icon">
                  💳
                </span>

                <span>
                  <strong>
                    Flooz
                  </strong>

                  <small>
                    Paiement Mobile Money
                  </small>
                </span>

              </button>


              <button
                type="button"
                className={`payment-method ${
                  paymentMethod === 'tmoney'
                    ? 'payment-method--active'
                    : ''
                }`}
                onClick={() =>
                  setPaymentMethod('tmoney')
                }
              >

                <span className="payment-method__icon">
                  📱
                </span>

                <span>
                  <strong>
                    TMoney
                  </strong>

                  <small>
                    Paiement Mobile Money
                  </small>
                </span>

              </button>

            </div>


            {/* Instructions de paiement */}

            <div className="payment-instructions">

              <div className="payment-instructions__icon">
                💰
              </div>

              <div>

                <strong>
                  Envoyez {formatPrice(total)}
                </strong>

                <p>
                  Envoyez le montant total au numéro :
                </p>

                <div className="payment-instructions__number">
                  {paymentNumbers[paymentMethod]}
                </div>

                <small>
                  Moyen sélectionné :{' '}
                  {paymentMethod === 'flooz'
                    ? 'Flooz'
                    : 'TMoney'}
                </small>

              </div>

            </div>


            {/* Numéro utilisé pour payer */}

            <div className="checkout__field">

              <label htmlFor="payment_phone">
                Numéro utilisé pour le paiement *
              </label>

              <input
                id="payment_phone"
                type="tel"
                value={paymentPhone}
                onChange={(e) =>
                  setPaymentPhone(e.target.value)
                }
                placeholder="Ex : 90 00 00 00"
                required
              />

              <small className="checkout__hint">
                Indiquez le numéro depuis lequel vous
                effectuerez le paiement.
              </small>

            </div>

          </section>


          {/* =================================================
              BOUTON
          ================================================== */}

          <button
            type="submit"
            className="checkout__submit"
            disabled={isSubmitting}
          >

            {isSubmitting ? (
              <>
                <span className="checkout__spinner" />
                Enregistrement de la commande...
              </>
            ) : (
              <>
                ✓ Confirmer ma commande
              </>
            )}

          </button>


          <p className="checkout__security">
            🔒 Vos informations sont transmises de manière
            sécurisée.
          </p>

        </form>


        {/* ===================================================
            RÉCAPITULATIF
        ==================================================== */}

        <aside className="checkout__summary">

          <div className="checkout__summary-card">

            <div className="checkout__summary-header">

              <h2>
                Votre commande
              </h2>

              <span>
                {items.length}{' '}
                {items.length > 1
                  ? 'produits'
                  : 'produit'}
              </span>

            </div>


            {/* Produits */}

            <div className="checkout__items">

              {items.map((item) => (

                <div
                  key={item.product.id}
                  className="checkout__item"
                >

                  <div className="checkout__item-image">

                    {item.product.image ? (

                      <img
                        src={item.product.image}
                        alt={item.product.name}
                      />

                    ) : (

                      <span>
                        🥬
                      </span>

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
                          decreaseQuantity(
                            item.product.id,
                            item.quantity
                          )
                        }
                        aria-label="Diminuer"
                      >
                        −
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          increaseQuantity(
                            item.product.id,
                            item.quantity,
                            item.product.quantity
                          )
                        }
                        disabled={
                          item.quantity >=
                          item.product.quantity
                        }
                        aria-label="Augmenter"
                      >
                        +
                      </button>

                    </div>

                  </div>


                  <div className="checkout__item-price">

                    <strong>
                      {formatPrice(
                        item.product.price *
                        item.quantity
                      )}
                    </strong>

                    <button
                      type="button"
                      onClick={() =>
                        removeItem(item.product.id)
                      }
                      className="checkout__remove"
                    >
                      Supprimer
                    </button>

                  </div>

                </div>

              ))}

            </div>


            {/* Total */}

            <div className="checkout__total">

              <div>
                <span>
                  Sous-total
                </span>

                <strong>
                  {formatPrice(total)}
                </strong>
              </div>


              <div>
                <span>
                  Livraison
                </span>

                <strong>
                  À confirmer
                </strong>
              </div>


              <div className="checkout__total-final">

                <span>
                  Total
                </span>

                <strong>
                  {formatPrice(total)}
                </strong>

              </div>

            </div>


            {/* Information */}

            <div className="checkout__summary-info">

              <span>
                🌱
              </span>

              <p>
                Le montant final de votre commande est
                recalculé et vérifié par notre serveur
                avant validation.
              </p>

            </div>

          </div>

        </aside>

      </div>

    </div>
  );
}

