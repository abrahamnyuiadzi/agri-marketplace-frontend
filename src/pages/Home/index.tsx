import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getCategories } from '../../services/categoryService';
import { getProducts } from '../../services/productService';

import { CategoryCard } from '../../components/category/CategoryCard';
import { ProductCard } from '../../components/product/ProductCard';
import { Loader } from '../../components/Loader';

import type { Category, Product } from '../../types';

import './styles.css';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  /**
   * Charger toutes les catégories
   */
  async function loadCategories() {
    try {
      const data = await getCategories();

      setCategories(data);
    } catch (error) {
      console.error(
        'Erreur lors du chargement des catégories :',
        error
      );
    } finally {
      setIsLoadingCategories(false);
    }
  }

  /**
   * Charger les produits
   */
  async function loadProducts() {
    try {
      const response = await getProducts({
        page: 1,
      });

      /**
       * Laravel paginate() retourne :
       *
       * {
       *   data: [...]
       *   current_page: 1,
       *   ...
       * }
       */

      setProducts(response.data);
    } catch (error) {
      console.error(
        'Erreur lors du chargement des produits :',
        error
      );
    } finally {
      setIsLoadingProducts(false);
    }
  }

  /**
   * Recherche
   */
  function handleSearch(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) {
      window.location.href = '/products';
      return;
    }

    window.location.href =
      `/products?search=${encodeURIComponent(query)}`;
  }

  return (
    <div className="home">

      {/* =========================
          HERO
      ========================== */}

      <section className="hero">
        <div className="hero__content">

          <span className="hero__badge">
            🌱 Produits frais et locaux
          </span>

          <h1 className="hero__title">
            Des produits agricoles
            <br />
            frais et de qualité
          </h1>

          <p className="hero__subtitle">
            Achetez directement auprès des cultivateurs
            et éleveurs. Soutenez l'agriculture locale.
          </p>

          <div className="hero__actions">

            <Link
              to="/products"
              className="hero__btn hero__btn--primary"
            >
              Découvrir les produits →
            </Link>

            <Link
              to="/register"
              className="hero__btn hero__btn--secondary"
            >
              Devenir vendeur
            </Link>

          </div>

          <form
            className="hero__search"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              placeholder="Rechercher un produit, une catégorie…"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
            />

            <button type="submit">
              🔍
            </button>
          </form>

        </div>

        <div
          className="hero__image"
          role="img"
          aria-label="Producteur agricole"
        />

      </section>

      {/* =========================
          CATÉGORIES
      ========================== */}

      <section className="section">

        <div className="section__header">

          <h2>
            Catégories populaires
          </h2>

          <Link to="/categories">
            Voir toutes les catégories →
          </Link>

        </div>

        {isLoadingCategories ? (

          <Loader />

        ) : categories.length === 0 ? (

          <p className="empty-message">
            Aucune catégorie disponible pour le moment.
          </p>

        ) : (

          <div className="categories-grid">

            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
              />
            ))}

          </div>

        )}

      </section>

      {/* =========================
          PRODUITS
      ========================== */}

      <section className="section">

        <div className="section__header">

          <h2>
            Produits populaires
          </h2>

          <Link to="/products">
            Voir tous les produits →
          </Link>

        </div>

        {isLoadingProducts ? (

          <Loader />

        ) : products.length === 0 ? (

          <p className="empty-message">
            Aucun produit disponible pour le moment.
          </p>

        ) : (

          <div className="products-grid">

            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}

          </div>

        )}

      </section>

      {/* =========================
          FEATURES
      ========================== */}

      <section className="features">

        <div className="feature">

          <span className="feature__icon">
            🌿
          </span>

          <div>
            <strong>
              Produits frais
            </strong>

            <p>
              Directement de nos fermes
            </p>
          </div>

        </div>

        <div className="feature">

          <span className="feature__icon">
            🏷️
          </span>

          <div>
            <strong>
              Prix justes
            </strong>

            <p>
              Sans intermédiaires
            </p>
          </div>

        </div>

        <div className="feature">

          <span className="feature__icon">
            🤝
          </span>

          <div>
            <strong>
              Soutien local
            </strong>

            <p>
              Valorisons nos producteurs
            </p>
          </div>

        </div>

        <div className="feature">

          <span className="feature__icon">
            🚚
          </span>

          <div>
            <strong>
              Livraison rapide
            </strong>

            <p>
              Partout au Togo
            </p>
          </div>

        </div>

      </section>

      {/* =========================
          CTA VENDEUR
      ========================== */}

      <section className="seller-cta">

        <div className="seller-cta__image">

          <img
            src="/images/agri-image2.jpg"
            alt="Productrice agricole"
          />

        </div>

        <div className="seller-cta__content">

          <h2>
            Vous êtes cultivateur ou éleveur ?
          </h2>

          <p>
            Rejoignez notre plateforme et vendez vos
            produits à des milliers d'acheteurs.
          </p>

          <Link
            to="/register"
            className="hero__btn hero__btn--primary"
          >
            S'inscrire comme vendeur →
          </Link>

        </div>

        <div className="seller-cta__stats">

          <div>
            <strong>
              +1200
            </strong>

            <span>
              Producteurs inscrits
            </span>
          </div>

          <div>
            <strong>
              +3500
            </strong>

            <span>
              Produits en vente
            </span>
          </div>

          <div>
            <strong>
              +8000
            </strong>

            <span>
              Clients satisfaits
            </span>
          </div>

        </div>

      </section>

    </div>
  );
}