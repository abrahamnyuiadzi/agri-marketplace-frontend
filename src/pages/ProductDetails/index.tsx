import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getProduct } from '../../services/productService';
import { formatPrice } from '../../utils/helpers';
import { useCart } from '../../hooks/useCart';
import { Loader } from '../../components/Loader';

import type { Product } from '../../types';

import './styles.css';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Produit introuvable.');
      setIsLoading(false);
      return;
    }

    getProduct(id)
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => {
        console.error(
          'Erreur lors du chargement du produit :',
          err
        );

        setError(
          'Impossible de charger les informations du produit.'
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="product-details__loading">
        <Loader />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details__error">
        <h2>Produit introuvable</h2>

        <p>
          {error ?? 'Ce produit n’existe pas.'}
        </p>

        <Link to="/products">
          ← Retour aux produits
        </Link>
      </div>
    );
  }

  const imageUrl = product.image
    ? `http://127.0.0.1:8000/storage/${product.image}`
    : null;

  const producer = product.farm?.owner;

  /**
   * Prépare le numéro pour WhatsApp.
   *
   * Exemple :
   * +228 90 12 34 56
   * devient :
   * 22890123456
   */
  const whatsappNumber = producer?.phone
    ? producer.phone.replace(/\D/g, '')
    : '';

  const whatsappMessage = encodeURIComponent(
    `Bonjour ${producer?.first_name ?? ''}, je suis intéressé(e) par votre produit "${product.name}" à ${product.price} FCFA/${product.unit}.`
  );

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`
    : null;

  function handleAddToCart() {
    addItem(product, 1);
  }

  return (
    <div className="product-details">

      {/* Retour */}
      <Link
        to="/products"
        className="product-details__back"
      >
        ← Retour aux produits
      </Link>

      {/* Produit */}
      <section className="product-details__main">

        {/* Image */}
        <div className="product-details__image-container">

          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="product-details__image"
            />
          ) : (
            <div className="product-details__image-placeholder">
              🥬
            </div>
          )}

        </div>

        {/* Informations produit */}
        <div className="product-details__info">

          {product.category && (
            <span className="product-details__category">
              {product.category.name}
            </span>
          )}

          <h1 className="product-details__name">
            {product.name}
          </h1>

          <div className="product-details__price">
            {formatPrice(product.price)}

            <span>
              / {product.unit}
            </span>
          </div>

          <div
            className={`product-details__availability ${
              product.is_available
                ? 'product-details__availability--available'
                : 'product-details__availability--unavailable'
            }`}
          >
            {product.is_available
              ? '✓ Produit disponible'
              : 'Produit indisponible'}
          </div>

          <div className="product-details__quantity">
            <strong>Quantité disponible :</strong>

            <span>
              {product.quantity} {product.unit}
            </span>
          </div>

          <div className="product-details__description">
            <h2>Description</h2>

            <p>
              {product.description}
            </p>
          </div>

          {product.is_available && (
            <button
              type="button"
              className="product-details__cart"
              onClick={handleAddToCart}
            >
              🛒 Ajouter au panier
            </button>
          )}

        </div>
      </section>

      {/* Informations ferme + producteur */}
      <section className="product-details__information">

        {/* Ferme */}
        {product.farm && (
          <div className="product-details__card">

            <div className="product-details__card-header">
              <span>🏡</span>

              <h2>
                Ferme de production
              </h2>
            </div>

            <div className="product-details__farm">

              {product.farm.image && (
                <img
                  src={`http://127.0.0.1:8000/storage/${product.farm.image}`}
                  alt={product.farm.name}
                  className="product-details__farm-image"
                />
              )}

              <div className="product-details__farm-content">

                <h3>
                  {product.farm.name}
                </h3>

                {product.farm.location && (
                  <p>
                    📍 {product.farm.location}
                  </p>
                )}

                {(product.farm.city ||
                  product.farm.country) && (
                  <p>
                    🌍{' '}
                    {[
                      product.farm.city,
                      product.farm.country,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                )}

                {product.farm.type && (
                  <p>
                    🌱 Type : {product.farm.type}
                  </p>
                )}

                {product.farm.surface !== undefined && (
                  <p>
                    📐 Surface : {product.farm.surface}
                  </p>
                )}

                {product.farm.description && (
                  <p className="product-details__farm-description">
                    {product.farm.description}
                  </p>
                )}

                {product.farm.is_verified && (
                  <span className="product-details__verified">
                    ✓ Ferme vérifiée
                  </span>
                )}

              </div>

            </div>
          </div>
        )}

        {/* Producteur */}
        {producer && (
          <div className="product-details__card">

            <div className="product-details__card-header">
              <span>👨‍🌾</span>

              <h2>
                Producteur
              </h2>
            </div>

            <div className="product-details__producer">

              <div className="product-details__producer-avatar">
                {producer.first_name?.charAt(0)}
                {producer.last_name?.charAt(0)}
              </div>

              <div className="product-details__producer-content">

                <h3>
                  {producer.first_name}{' '}
                  {producer.last_name}
                </h3>

                {producer.phone && (
                  <p>
                    📞 {producer.phone}
                  </p>
                )}

                {producer.email && (
                  <p>
                    ✉️ {producer.email}
                  </p>
                )}

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="product-details__whatsapp"
                  >
                    💬 Contacter sur WhatsApp
                  </a>
                )}

              </div>

            </div>
          </div>
        )}

      </section>
    </div>
  );
}