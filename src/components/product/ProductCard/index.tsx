import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../../types';
import { formatPrice } from '../../../utils/helpers';
import { useCart } from '../../../hooks/useCart';
import './styles.css';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault(); // évite de suivre le lien vers la page produit
    addItem(product, 1);
  }

  function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    setIsFavorite((prev) => !prev);
    // TODO: brancher sur un vrai endpoint /favorites côté Laravel
  }

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card__image">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} />
        ) : (
          <div className="product-card__image-placeholder">🥬</div>
        )}
        <button
          className={`product-card__favorite ${isFavorite ? 'product-card__favorite--active' : ''}`}
          onClick={toggleFavorite}
          aria-label="Ajouter aux favoris"
        >
          ♥
        </button>
      </div>

      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        {product.farm && (
          <p className="product-card__farm">
            {product.farm.name} · 📍 {product.farm.location}
          </p>
        )}
        <div className="product-card__footer">
          <span className="product-card__price">
            {formatPrice(product.price)} <span className="product-card__unit">/ {product.unit}</span>
          </span>
          <button className="product-card__add" onClick={handleAddToCart}>
            Ajouter
          </button>
        </div>
      </div>
    </Link>
  );
}