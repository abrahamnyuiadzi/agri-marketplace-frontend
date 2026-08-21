import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../../services/categoryService';
import { getProducts } from '../../services/productService';
import { CategoryCard } from '../../components/category/CategoryCard';
import { ProductCard } from '../../components/product/ProductCard';

import type { Category, Product } from '../../types';
import './styles.css';
import { Loader } from '../../components/Loader';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    Promise.all([getCategories(), getProducts({ page: 1 })])
      .then(([categoriesData, productsData]) => {
        setCategories(categoriesData);
        setProducts(productsData.data);
      })
      .catch((err) => console.error('Erreur de chargement de la Home:', err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__content">
          <span className="hero__badge">🌱 Produits frais et locaux</span>
          <h1 className="hero__title">
            Des produits agricoles
            <br />
            frais et de qualité
          </h1>
          <p className="hero__subtitle">
            Achetez directement auprès des cultivateurs et éleveurs. Soutenez l'agriculture locale.
          </p>

          <div className="hero__actions">
            <Link to="/products" className="hero__btn hero__btn--primary">
              Découvrir les produits →
            </Link>
            <Link to="/register" className="hero__btn hero__btn--secondary">
              Devenir vendeur
            </Link>
          </div>

          <form
            className="hero__search"
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
            }}
          >
            <input
              type="text"
              placeholder="Rechercher un produit, une catégorie…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">🔍</button>
          </form>
        </div>

        <div className="hero__image" role="img" aria-label="Producteur agricole" />
      </section>

      {/* Catégories populaires */}
      <section className="section">
        <div className="section__header">
          <h2>Catégories populaires</h2>
          <Link to="/categories">Voir toutes les catégories →</Link>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <div className="categories-grid">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>

      {/* Produits populaires */}
      <section className="section">
        <div className="section__header">
          <h2>Produits populaires</h2>
          <Link to="/products">Voir tous les produits →</Link>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="features">
        <div className="feature">
          <span className="feature__icon">🌿</span>
          <div>
            <strong>Produits frais</strong>
            <p>Directement de nos fermes</p>
          </div>
        </div>
        <div className="feature">
          <span className="feature__icon">🏷️</span>
          <div>
            <strong>Prix justes</strong>
            <p>Sans intermédiaires</p>
          </div>
        </div>
        <div className="feature">
          <span className="feature__icon">🤝</span>
          <div>
            <strong>Soutien local</strong>
            <p>Valorisons nos producteurs</p>
          </div>
        </div>
        <div className="feature">
          <span className="feature__icon">🚚</span>
          <div>
            <strong>Livraison rapide</strong>
            <p>Partout au Togo</p>
          </div>
        </div>
      </section>

      {/* CTA vendeur */}
      <section className="seller-cta">
        <div className="seller-cta__image">
          <img src="/images/agri-image2.jpg" alt="Productrice agricole" />
        </div>
        <div className="seller-cta__content">
          <h2>Vous êtes cultivateur ou éleveur ?</h2>
          <p>Rejoignez notre plateforme et vendez vos produits à des milliers d'acheteurs.</p>
          <Link to="/register" className="hero__btn hero__btn--primary">
            S'inscrire comme vendeur →
          </Link>
        </div>
        <div className="seller-cta__stats">
          <div>
            <strong>+1200</strong>
            <span>Producteurs inscrits</span>
          </div>
          <div>
            <strong>+3500</strong>
            <span>Produits en vente</span>
          </div>
          <div>
            <strong>+8000</strong>
            <span>Clients satisfaits</span>
          </div>
        </div>
      </section>
    </div>
  );
}