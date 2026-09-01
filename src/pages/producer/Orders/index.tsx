import { useEffect, useState } from 'react';
import { getProducerOrders } from '../../../services/productService';
import type { Order, OrderItem } from '../../../types';
import './styles.css';

export default function ProducerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getProducerOrders(1);

      setOrders(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des commandes :', err);
      setError(
        'Impossible de charger les commandes pour le moment.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Calcul du total des produits appartenant
   * au producteur connecté.
   */
  function calculateProducerTotal(items: OrderItem[]) {
    return items.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0
    );
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(date));
  }

  function getStatusLabel(status: Order['status']) {
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
  }

  function getStatusClass(status: Order['status']) {
    return `producer-order__status producer-order__status--${status}`;
  }

  if (isLoading) {
    return (
      <div className="producer-orders">
        <div className="producer-orders__loading">
          Chargement des commandes...
        </div>
      </div>
    );
  }

  return (
    <div className="producer-orders">

      {/* HEADER */}
      <div className="producer-orders__header">
        <div>
          <h1>Commandes reçues</h1>

          <p>
            Retrouvez ici les commandes contenant vos produits.
          </p>
        </div>

        <button
          type="button"
          className="producer-orders__refresh"
          onClick={loadOrders}
        >
          ↻ Actualiser
        </button>
      </div>

      {/* ERREUR */}
      {error && (
        <div className="producer-orders__error">
          {error}
        </div>
      )}

      {/* AUCUNE COMMANDE */}
      {!error && orders.length === 0 && (
        <div className="producer-orders__empty">
          <div className="producer-orders__empty-icon">
            🛒
          </div>

          <h2>Aucune commande reçue</h2>

          <p>
            Les commandes contenant vos produits
            apparaîtront ici.
          </p>
        </div>
      )}

      {/* COMMANDES */}
      <div className="producer-orders__list">

        {orders.map((order) => {

          /*
           * Les items reçus ici sont déjà filtrés
           * côté Laravel pour ce producteur.
           */
          const producerTotal = calculateProducerTotal(
            order.items
          );

          return (
            <article
              key={order.id}
              className="producer-order"
            >

              {/* EN-TÊTE COMMANDE */}
              <div className="producer-order__header">

                <div>
                  <h2>
                    Commande #{order.id}
                  </h2>

                  <span className="producer-order__date">
                    {formatDate(order.created_at)}
                  </span>
                </div>

                <span className={getStatusClass(order.status)}>
                  {getStatusLabel(order.status)}
                </span>

              </div>

              {/* INFORMATIONS CLIENT */}
              <div className="producer-order__customer">

                <div className="producer-order__section">

                  <h3>
                    👤 Informations du commandeur
                  </h3>

                  <p>
                    <strong>
                      {order.first_name} {order.last_name}
                    </strong>
                  </p>

                  <p>
                    📞 {order.phone}
                  </p>

                  {order.email && (
                    <p>
                      ✉️ {order.email}
                    </p>
                  )}

                </div>

                {/* LIVRAISON */}
                <div className="producer-order__section">

                  <h3>
                    📍 Livraison
                  </h3>

                  <p>
                    {order.address}
                  </p>

                  <p>
                    {order.neighborhood
                      ? `${order.neighborhood}, `
                      : ''}
                    {order.city}
                  </p>

                  {order.note && (
                    <p className="producer-order__note">
                      <strong>Note :</strong>{' '}
                      {order.note}
                    </p>
                  )}

                </div>

              </div>

              {/* PRODUITS */}
              <div className="producer-order__products">

                <h3>
                  🛒 Vos produits dans cette commande
                </h3>

                {order.items.map((item) => {

                  const subtotal =
                    Number(item.price) * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="producer-order__product"
                    >

                      <div className="producer-order__product-image">

                        {item.product?.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                          />
                        ) : (
                          <span>🌱</span>
                        )}

                      </div>

                      <div className="producer-order__product-info">

                        <strong>
                          {item.product?.name ??
                            `Produit #${item.product_id}`}
                        </strong>

                        <span>
                          {item.quantity}{' '}
                          {item.product?.unit ?? 'unité'}
                          {' × '}
                          {formatPrice(Number(item.price))}
                        </span>

                      </div>

                      <strong className="producer-order__product-total">
                        {formatPrice(subtotal)}
                      </strong>

                    </div>
                  );
                })}

              </div>

              {/* PIED DE COMMANDE */}
              <div className="producer-order__footer">

                <div className="producer-order__payment">

                  <span>
                    💳 Paiement
                  </span>

                  <strong>
                    {order.payment_method === 'flooz'
                      ? 'Flooz'
                      : 'TMoney'}
                  </strong>

                  <span>
                    {order.payment_phone}
                  </span>

                </div>

                <div className="producer-order__total">

                  <span>
                    Total de vos produits
                  </span>

                  <strong>
                    {formatPrice(producerTotal)}
                  </strong>

                </div>

              </div>

            </article>
          );
        })}

      </div>
    </div>
  );
}