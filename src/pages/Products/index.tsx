import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getProducts } from '../../services/productService';
import { ProductCard } from '../../components/product/ProductCard';
import { Loader } from '../../components/Loader';

import type { Product } from '../../types';

import './styles.css';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  /**
   * Charger tous les produits
   */
  async function loadProducts() {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getProducts({
        page: 1,
      });

      setProducts(response.data);
    } catch (err) {
      console.error(
        'Erreur lors du chargement des produits :',
        err
      );

      setError(
        'Impossible de charger les produits pour le moment.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="products-page">

      {/* =========================
          EN-TÊTE
      ========================== */}

      <div className="products-page__header">

        <div>
          <span className="products-page__badge">
            🌱 Agri Marketplace
          </span>

          <h1>
            Tous les produits
          </h1>

          <p>
            Découvrez les produits agricoles proposés
            directement par nos producteurs.
          </p>
        </div>

        <Link
          to="/"
          className="products-page__home-link"
        >
          ← Retour à l'accueil
        </Link>

      </div>


      {/* =========================
          CONTENU
      ========================== */}

      {isLoading ? (

        <div className="products-page__loader">
          <Loader />
        </div>

      ) : error ? (

        <div className="products-page__error">
          <p>{error}</p>

          <button
            onClick={loadProducts}
            className="products-page__retry"
          >
            Réessayer
          </button>
        </div>

      ) : products.length === 0 ? (

        <div className="products-page__empty">
          <div className="products-page__empty-icon">
            🥬
          </div>

          <h2>
            Aucun produit disponible
          </h2>

          <p>
            Les producteurs n'ont pas encore ajouté
            de produits sur la plateforme.
          </p>

          <Link
            to="/"
            className="products-page__empty-link"
          >
            Retour à l'accueil
          </Link>
        </div>

      ) : (

        <>
          {/* Nombre de produits */}

          <div className="products-page__count">
            <strong>{products.length}</strong>{' '}
            produit{products.length > 1 ? 's' : ''} disponible
            {products.length > 1 ? 's' : ''}
          </div>

          {/* Liste des produits */}

          <div className="products-page__grid">

            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}

          </div>
        </>

      )}

    </div>
  );
}