import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import type { Order, DeliveryStatus } from '../../types/order';
import './styles.css';

const formatPrice = (price: number | string) => {
  return `${Number(price).toLocaleString('fr-FR')} FCFA`;
};

const formatDate = (date?: string | null) => {
  if (!date) return '—';

  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getOrderStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'En attente';
    case 'confirmed':
      return 'Confirmée';
    case 'shipped':
      return 'Expédiée';
    case 'delivered':
      return 'Livrée';
    case 'cancelled':
      return 'Annulée';
    default:
      return status;
  }
};

const getDeliveryStatusLabel = (status?: DeliveryStatus | null) => {
  switch (status) {
    case 'pending':
      return 'En attente';
    case 'preparing':
      return 'En préparation';
    case 'shipped':
      return 'Expédiée';
    case 'in_transit':
      return 'En transit';
    case 'delivered':
      return 'Livrée';
    case 'cancelled':
      return 'Annulée';
    default:
      return '—';
  }
};

const getPaymentStatusLabel = (status?: string | null) => {
  switch (status) {
    case 'pending':
      return 'En attente';
    case 'processing':
      return 'En cours';
    case 'paid':
      return 'Payé';
    case 'failed':
      return 'Échoué';
    case 'cancelled':
      return 'Annulé';
    default:
      return '—';
  }
};

const getPaymentMethodLabel = (method?: string | null) => {
  switch (method) {
    case 'flooz':
      return 'Flooz';
    case 'tmoney':
      return 'T-Money';
    default:
      return method || '—';
  }
};

const deliverySteps = [
  {
    key: 'pending',
    title: 'Commande reçue',
    description: 'Votre commande a bien été enregistrée.',
  },
  {
    key: 'preparing',
    title: 'Préparation',
    description: 'Le producteur prépare votre commande.',
  },
  {
    key: 'shipped',
    title: 'Expédiée',
    description: 'Votre commande a été remise pour livraison.',
  },
  {
    key: 'in_transit',
    title: 'En transit',
    description: 'Votre commande est en cours de livraison.',
  },
  {
    key: 'delivered',
    title: 'Livrée',
    description: 'Votre commande a été livrée.',
  },
];

const getStepIndex = (status?: DeliveryStatus | null) => {
  switch (status) {
    case 'pending':
      return 0;
    case 'preparing':
      return 1;
    case 'shipped':
      return 2;
    case 'in_transit':
      return 3;
    case 'delivered':
      return 4;
    case 'cancelled':
      return -1;
    default:
      return 0;
  }
};

interface ApiOrderResponse {
  success: boolean;
  data: Order;
  message?: string;
}

export default function OrderTracking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setError('Identifiant de commande invalide.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const response = await api.get<ApiOrderResponse>(
          `/orders/${id}`
        );

        setOrder(response.data.data);
      } catch (err: any) {
        console.error('Erreur récupération commande:', err);

        if (err.response?.status === 401) {
          setError(
            'Votre session a expiré. Veuillez vous reconnecter.'
          );
        } else if (err.response?.status === 403) {
          setError(
            'Vous n’êtes pas autorisé à consulter cette commande.'
          );
        } else if (err.response?.status === 404) {
          setError('Commande introuvable.');
        } else {
          setError(
            err.response?.data?.message ||
              'Impossible de récupérer les informations de la commande.'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="tracking-page">
        <div className="tracking-container">
          <div className="tracking-loading">
            <div className="loading-spinner"></div>
            <p>Chargement de votre commande...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="tracking-page">
        <div className="tracking-container">
          <div className="tracking-error">
            <div className="error-icon">!</div>

            <h2>Impossible d'afficher la commande</h2>

            <p>{error || 'Commande introuvable.'}</p>

            <button
              type="button"
              className="tracking-button"
              onClick={() => navigate('/orders')}
            >
              Retour à mes commandes
            </button>
          </div>
        </div>
      </div>
    );
  }

  const deliveryStatus = order.delivery?.status || 'pending';
  const currentStep = getStepIndex(deliveryStatus);

  const isCancelled =
    order.status === 'cancelled' ||
    order.delivery?.status === 'cancelled';

  return (
    <div className="tracking-page">
      <div className="tracking-container">

        {/* HEADER */}
        <div className="tracking-header">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            ← Retour
          </button>

          <div className="header-content">
            <div>
              <p className="page-label">SUIVI DE COMMANDE</p>

              <h1>
                Commande #{order.id}
              </h1>

              <p className="order-date">
                Passée le {formatDate(order.created_at)}
              </p>
            </div>

            <div
              className={`order-status status-${order.status}`}
            >
              {getOrderStatusLabel(order.status)}
            </div>
          </div>
        </div>

        {/* CANCELLED */}
        {isCancelled && (
          <div className="cancelled-card">
            <div className="cancelled-icon">×</div>

            <div>
              <h3>Commande annulée</h3>
              <p>
                Cette commande ou sa livraison a été annulée.
              </p>
            </div>
          </div>
        )}

        {/* TIMELINE */}
        {!isCancelled && (
          <section className="tracking-card">
            <div className="section-header">
              <div>
                <span className="section-icon">🚚</span>

                <div>
                  <h2>Suivi de livraison</h2>

                  <p>
                    {getDeliveryStatusLabel(
                      order.delivery?.status
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="timeline">
              {deliverySteps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;

                return (
                  <div
                    key={step.key}
                    className={`timeline-step ${
                      isCompleted ? 'completed' : ''
                    } ${isCurrent ? 'current' : ''}`}
                  >
                    <div className="timeline-left">
                      <div className="timeline-dot">
                        {isCompleted
                          ? '✓'
                          : isCurrent
                          ? '•'
                          : index + 1}
                      </div>

                      {index < deliverySteps.length - 1 && (
                        <div className="timeline-line"></div>
                      )}
                    </div>

                    <div className="timeline-content">
                      <h3>{step.title}</h3>

                      <p>{step.description}</p>

                      {isCurrent && (
                        <span className="current-badge">
                          Étape actuelle
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* DELIVERY INFORMATION */}
        <section className="tracking-card">
          <div className="section-title">
            <span className="section-icon">📍</span>

            <div>
              <h2>Informations de livraison</h2>

              <p>
                Informations concernant la livraison de votre
                commande.
              </p>
            </div>
          </div>

          <div className="info-grid">

            <InfoItem
              label="Adresse"
              value={order.delivery?.delivery_address || order.address}
            />

            <InfoItem
              label="Ville"
              value={order.delivery?.city || order.city}
            />

            <InfoItem
              label="Quartier"
              value={
                order.delivery?.neighborhood ||
                order.neighborhood ||
                '—'
              }
            />

            <InfoItem
              label="Code de suivi"
              value={
                order.delivery?.tracking_code || 'Pas encore attribué'
              }
            />

            <InfoItem
              label="Livreur"
              value={
                order.delivery?.delivery_person ||
                'Pas encore attribué'
              }
            />

            <InfoItem
              label="Téléphone du livreur"
              value={
                order.delivery?.delivery_phone ||
                'Pas encore disponible'
              }
            />
          </div>
        </section>

        {/* CUSTOMER INFORMATION */}
        <section className="tracking-card">
          <div className="section-title">
            <span className="section-icon">👤</span>

            <div>
              <h2>Informations du client</h2>

              <p>Coordonnées utilisées pour la commande.</p>
            </div>
          </div>

          <div className="info-grid">

            <InfoItem
              label="Nom complet"
              value={`${order.first_name} ${order.last_name}`}
            />

            <InfoItem
              label="Téléphone"
              value={order.phone}
            />

            <InfoItem
              label="Email"
              value={order.email || '—'}
            />

            <InfoItem
              label="Adresse"
              value={order.address}
            />
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="tracking-card">
          <div className="section-title">
            <span className="section-icon">🛒</span>

            <div>
              <h2>Produits commandés</h2>

              <p>
                {order.items?.length || 0} article
                {order.items?.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="order-items">
            {order.items?.map((item) => (
              <div
                className="order-item"
                key={item.id}
              >
                <div className="product-image">
                  {item.product?.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                    />
                  ) : (
                    <span>🌾</span>
                  )}
                </div>

                <div className="product-info">
                  <h3>
                    {item.product?.name ||
                      `Produit #${item.product_id}`}
                  </h3>

                  <p>
                    Quantité : {item.quantity}
                  </p>

                  {item.product?.unit && (
                    <span>
                      Unité : {item.product.unit}
                    </span>
                  )}
                </div>

                <div className="product-price">
                  <span>
                    {formatPrice(item.price)}
                  </span>

                  <small>
                    {item.quantity} ×{' '}
                    {formatPrice(item.price)}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PAYMENT */}
        <section className="tracking-card">
          <div className="section-title">
            <span className="section-icon">💳</span>

            <div>
              <h2>Paiement</h2>

              <p>Informations relatives au paiement.</p>
            </div>
          </div>

          <div className="payment-grid">

            <div className="payment-item">
              <span>Méthode</span>

              <strong>
                {getPaymentMethodLabel(
                  order.payment?.method ||
                    order.payment_method
                )}
              </strong>
            </div>

            <div className="payment-item">
              <span>Statut</span>

              <strong
                className={`payment-status payment-${order.payment?.status}`}
              >
                {getPaymentStatusLabel(
                  order.payment?.status
                )}
              </strong>
            </div>

            <div className="payment-item">
              <span>Numéro de paiement</span>

              <strong>
                {order.payment?.payment_phone ||
                  order.payment_phone ||
                  '—'}
              </strong>
            </div>
          </div>

          {order.payment?.transaction_reference && (
            <div className="transaction-reference">
              <span>Référence de transaction</span>

              <strong>
                {order.payment.transaction_reference}
              </strong>
            </div>
          )}
        </section>

        {/* TOTAL */}
        <section className="total-card">
          <div>
            <span>Total de la commande</span>

            <p>
              {order.items?.length || 0} article
              {order.items?.length > 1 ? 's' : ''}
            </p>
          </div>

          <strong>
            {formatPrice(order.total)}
          </strong>
        </section>

        {/* NOTE */}
        {order.note && (
          <section className="tracking-card">
            <div className="section-title">
              <span className="section-icon">📝</span>

              <div>
                <h2>Note de la commande</h2>

                <p>Message laissé lors de la commande.</p>
              </div>
            </div>

            <div className="order-note">
              {order.note}
            </div>
          </section>
        )}

        {/* FOOTER ACTION */}
        <div className="tracking-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate('/orders')}
          >
            Mes commandes
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={() => navigate('/')}
          >
            Continuer mes achats
          </button>
        </div>

      </div>
    </div>
  );
}

/* ================================
   INFO ITEM
================================ */

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({
  label,
  value,
}: InfoItemProps) {
  return (
    <div className="info-item">
      <span>{label}</span>

      <strong>{value}</strong>
    </div>
  );
}