import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import type { Order } from '../../types/order';
import './styles.css';

interface OrdersResponse {
  success: boolean;
  data: {
    data: Order[];
    current_page: number;
    last_page: number;
    total: number;
  };
  message?: string;
}

const formatPrice = (price: number | string) => {
  return `${Number(price).toLocaleString('fr-FR')} FCFA`;
};

const formatDate = (date?: string | null) => {
  if (!date) return '—';

  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
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

const getDeliveryStatusLabel = (status?: string | null) => {
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

export default function MyOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get<OrdersResponse>(
        '/my-orders'
      );

      setOrders(response.data.data.data);
    } catch (err: any) {
      console.error(
        'Erreur lors de la récupération des commandes :',
        err
      );

      if (err.response?.status === 401) {
        setError(
          'Votre session a expiré. Veuillez vous reconnecter.'
        );
      } else {
        setError(
          err.response?.data?.message ||
            'Impossible de récupérer vos commandes.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="my-orders-page">
        <div className="my-orders-container">
          <div className="orders-loading">
            <div className="orders-spinner"></div>

            <p>
              Chargement de vos commandes...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================
     ERROR
  ========================================= */

  if (error) {
    return (
      <div className="my-orders-page">
        <div className="my-orders-container">
          <div className="orders-error">

            <div className="orders-error-icon">
              !
            </div>

            <h2>
              Impossible de charger vos commandes
            </h2>

            <p>{error}</p>

            <div className="orders-error-actions">

              <button
                type="button"
                className="orders-primary-button"
                onClick={fetchOrders}
              >
                Réessayer
              </button>

              <button
                type="button"
                className="orders-secondary-button"
                onClick={() => navigate('/')}
              >
                Retour à l'accueil
              </button>

            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================
     PAGE
  ========================================= */

  return (
    <div className="my-orders-page">

      <div className="my-orders-container">

        {/* HEADER */}
        <div className="my-orders-header">

          <div>
            <p className="orders-page-label">
              MON ESPACE
            </p>

            <h1>
              Mes commandes
            </h1>

            <p className="orders-page-description">
              Consultez vos commandes et suivez leur
              livraison.
            </p>
          </div>

          <button
            type="button"
            className="continue-shopping-button"
            onClick={() => navigate('/')}
          >
            ← Continuer mes achats
          </button>

        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 ? (
          <div className="orders-empty">

            <div className="empty-icon">
              🛒
            </div>

            <h2>
              Vous n'avez pas encore de commande
            </h2>

            <p>
              Découvrez nos produits agricoles et
              passez votre première commande.
            </p>

            <button
              type="button"
              className="orders-primary-button"
              onClick={() => navigate('/')}
            >
              Découvrir les produits
            </button>

          </div>
        ) : (
          <>
            {/* SUMMARY */}
            <div className="orders-summary">

              <div className="summary-item">
                <span>
                  Total des commandes
                </span>

                <strong>
                  {orders.length}
                </strong>
              </div>

              <div className="summary-item">
                <span>
                  En cours
                </span>

                <strong>
                  {
                    orders.filter(
                      (order) =>
                        ![
                          'delivered',
                          'cancelled',
                        ].includes(order.status)
                    ).length
                  }
                </strong>
              </div>

              <div className="summary-item">
                <span>
                  Livrées
                </span>

                <strong>
                  {
                    orders.filter(
                      (order) =>
                        order.status === 'delivered'
                    ).length
                  }
                </strong>
              </div>

            </div>

            {/* ORDERS LIST */}
            <div className="orders-list">

              {orders.map((order) => {

                const deliveryStatus =
                  order.delivery?.status;

                return (
                  <article
                    className="order-card"
                    key={order.id}
                  >

                    {/* ORDER HEADER */}
                    <div className="order-card-header">

                      <div>
                        <div className="order-number">
                          Commande #{order.id}
                        </div>

                        <div className="order-date">
                          {formatDate(order.created_at)}
                        </div>
                      </div>

                      <span
                        className={`order-status-badge status-${order.status}`}
                      >
                        {getOrderStatusLabel(
                          order.status
                        )}
                      </span>

                    </div>

                    {/* PRODUCTS */}
                    <div className="order-products">

                      {order.items?.slice(0, 3).map(
                        (item) => (
                          <div
                            className="mini-product"
                            key={item.id}
                          >

                            <div className="mini-product-image">

                              {item.product?.image ? (
                                <img
                                  src={
                                    item.product.image
                                  }
                                  alt={
                                    item.product.name
                                  }
                                />
                              ) : (
                                <span>
                                  🌾
                                </span>
                              )}

                            </div>

                            <div className="mini-product-info">

                              <strong>
                                {item.product?.name ||
                                  `Produit #${item.product_id}`}
                              </strong>

                              <span>
                                Quantité :{' '}
                                {item.quantity}
                              </span>

                            </div>

                            <strong className="mini-product-price">
                              {formatPrice(item.price)}
                            </strong>

                          </div>
                        )
                      )}

                      {order.items &&
                        order.items.length > 3 && (
                          <div className="more-products">
                            +{' '}
                            {order.items.length - 3}{' '}
                            autre
                            {order.items.length - 3 > 1
                              ? 's'
                              : ''}{' '}
                            produit
                            {order.items.length - 3 > 1
                              ? 's'
                              : ''}
                          </div>
                        )}

                    </div>

                    {/* ORDER DETAILS */}
                    <div className="order-details">

                      <div className="order-detail">
                        <span>
                          Paiement
                        </span>

                        <strong>
                          {getPaymentMethodLabel(
                            order.payment?.method ||
                              order.payment_method
                          )}
                        </strong>
                      </div>

                      <div className="order-detail">
                        <span>
                          Statut paiement
                        </span>

                        <strong>
                          {getPaymentStatusLabel(
                            order.payment?.status
                          )}
                        </strong>
                      </div>

                      <div className="order-detail">
                        <span>
                          Livraison
                        </span>

                        <strong>
                          {getDeliveryStatusLabel(
                            deliveryStatus
                          )}
                        </strong>
                      </div>

                      <div className="order-detail">
                        <span>
                          Total
                        </span>

                        <strong className="order-total">
                          {formatPrice(order.total)}
                        </strong>
                      </div>

                    </div>

                    {/* DELIVERY BAR */}
                    {deliveryStatus &&
                      deliveryStatus !==
                        'cancelled' && (
                        <div className="delivery-progress">

                          <div className="delivery-progress-header">

                            <span>
                              État de la livraison
                            </span>

                            <strong>
                              {getDeliveryStatusLabel(
                                deliveryStatus
                              )}
                            </strong>

                          </div>

                          <DeliveryProgress
                            status={
                              deliveryStatus
                            }
                          />

                        </div>
                      )}

                    {/* FOOTER */}
                    <div className="order-card-footer">

                      <div className="delivery-address">

                        <span>
                          Livraison à
                        </span>

                        <strong>
                          {order.city}
                          {order.neighborhood
                            ? `, ${order.neighborhood}`
                            : ''}
                        </strong>

                      </div>

                      <button
                        type="button"
                        className="track-order-button"
                        onClick={() =>
                          navigate(
                            `/orders/${order.id}`
                          )
                        }
                      >
                        Suivre la commande →
                      </button>

                    </div>

                  </article>
                );
              })}

            </div>
          </>
        )}

      </div>
    </div>
  );
}

/* =========================================
   DELIVERY PROGRESS
========================================= */

interface DeliveryProgressProps {
  status: string;
}

function DeliveryProgress({
  status,
}: DeliveryProgressProps) {

  const steps = [
    {
      key: 'pending',
      label: 'Reçue',
    },
    {
      key: 'preparing',
      label: 'Préparation',
    },
    {
      key: 'shipped',
      label: 'Expédiée',
    },
    {
      key: 'in_transit',
      label: 'Transit',
    },
    {
      key: 'delivered',
      label: 'Livrée',
    },
  ];

  const statusIndex = steps.findIndex(
    (step) => step.key === status
  );

  const currentIndex =
    statusIndex >= 0 ? statusIndex : 0;

  return (
    <div className="delivery-progress-track">

      {steps.map((step, index) => {

        const completed =
          index <= currentIndex;

        return (
          <div
            className="progress-step"
            key={step.key}
          >

            <div
              className={`progress-dot ${
                completed
                  ? 'progress-completed'
                  : ''
              }`}
            >
              {completed ? '✓' : ''}
            </div>

            <span
              className={
                completed
                  ? 'progress-label progress-label-active'
                  : 'progress-label'
              }
            >
              {step.label}
            </span>

            {index < steps.length - 1 && (
              <div
                className={`progress-line ${
                  index < currentIndex
                    ? 'progress-line-active'
                    : ''
                }`}
              />
            )}

          </div>
        );
      })}

    </div>
  );
}