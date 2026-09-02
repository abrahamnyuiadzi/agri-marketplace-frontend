import { useEffect, useState } from 'react';

import {
  getAdminProducts,
  deleteAdminProduct,
} from '../../../services/productService';

import type { Product } from '../../../types';

import { Loader } from '../../../components/Loader';

import './styles.css';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Charger les produits
   */
  async function loadProducts() {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getAdminProducts(1);

      setProducts(response.data);
    } catch (error) {
      console.error(
        'Erreur lors du chargement des produits :',
        error
      );

      setError(
        'Impossible de charger les produits.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  /**
   * Supprimer un produit
   */
  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      'Voulez-vous vraiment supprimer ce produit ?'
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteAdminProduct(id);

      setProducts((current) =>
        current.filter((product) => product.id !== id)
      );

      alert('Produit supprimé avec succès.');

    } catch (error) {
      console.error(
        'Erreur lors de la suppression du produit :',
        error
      );

      alert(
        'Impossible de supprimer ce produit.'
      );
    }
  }

  return (
    <div className="admin-products">

      {/* HEADER */}
      <div className="admin-products__header">

        <div>
          <span className="admin-products__badge">
            📦 Administration
          </span>

          <h1>Tous les produits</h1>

          <p>
            Consultez et gérez tous les produits
            proposés par les producteurs.
          </p>
        </div>

        <div className="admin-products__counter">
          <strong>{products.length}</strong>
          <span>Produits</span>
        </div>

      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="admin-products__loader">
          <Loader />
        </div>
      )}

      {/* ERROR */}
      {!isLoading && error && (
        <div className="admin-products__error">

          <div className="admin-products__error-icon">
            ⚠️
          </div>

          <p>{error}</p>

          <button onClick={loadProducts}>
            Réessayer
          </button>

        </div>
      )}

      {/* EMPTY */}
      {!isLoading &&
        !error &&
        products.length === 0 && (
          <div className="admin-products__empty">

            <div className="admin-products__empty-icon">
              📦
            </div>

            <h2>
              Aucun produit
            </h2>

            <p>
              Aucun produit n'est actuellement
              enregistré sur la plateforme.
            </p>

          </div>
        )}

      {/* TABLE */}
      {!isLoading &&
        !error &&
        products.length > 0 && (

          <div className="admin-products__table-container">

            <table className="admin-products__table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Produit</th>
                  <th>Prix</th>
                  <th>Quantité</th>
                  <th>Unité</th>
                  <th>Catégorie</th>
                  <th>Producteur</th>
                  <th>Exploitation</th>
                  <th>Disponibilité</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {products.map((product) => (
                  <tr key={product.id}>

                    {/* ID */}
                    <td>
                      <span className="product-id">
                        #{product.id}
                      </span>
                    </td>

                    {/* PRODUIT */}
                    <td>
                      <div className="admin-product-name">

                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="admin-product-image"
                          />
                        ) : (
                          <div className="admin-product-placeholder">
                            🌱
                          </div>
                        )}

                        <strong>
                          {product.name}
                        </strong>

                      </div>
                    </td>

                    {/* PRIX */}
                    <td>
                      <strong className="product-price">
                        {Number(product.price).toLocaleString(
                          'fr-FR'
                        )}{' '}
                        FCFA
                      </strong>
                    </td>

                    {/* QUANTITÉ */}
                    <td>
                      {product.quantity}
                    </td>

                    {/* UNITÉ */}
                    <td>
                      {product.unit}
                    </td>

                    {/* CATÉGORIE */}
                    <td>
                      {product.category?.name ?? '—'}
                    </td>

                    {/* PRODUCTEUR */}
                    <td>
                      {product.user ? (
                        <span>
                          {product.user.first_name}{' '}
                          {product.user.last_name}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>

                    {/* FERME */}
                    <td>
                      {product.farm?.name ?? '—'}
                    </td>

                    {/* DISPONIBILITÉ */}
                    <td>

                      {product.is_available ? (
                        <span className="product-status product-status--available">
                          Disponible
                        </span>
                      ) : (
                        <span className="product-status product-status--unavailable">
                          Indisponible
                        </span>
                      )}

                    </td>

                    {/* ACTIONS */}
                    <td>

                      <div className="product-actions">

                        <button
                          type="button"
                          className="product-action product-action--view"
                          title="Voir le produit"
                        >
                          👁
                        </button>

                        <button
                          type="button"
                          className="product-action product-action--delete"
                          title="Supprimer le produit"
                          onClick={() =>
                            handleDelete(product.id)
                          }
                        >
                          🗑
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

    </div>
  );
}