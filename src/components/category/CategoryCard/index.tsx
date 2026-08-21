import { Link } from 'react-router-dom';
import type { Category } from '../../../types';
import './styles.css';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link to={`/products?category_id=${category.id}`} className="category-card">
      <div className="category-card__icon">
        {category.image_url ? (
          <img src={category.image_url} alt={category.name} />
        ) : (
          <span>🌱</span>
        )}
      </div>
      <span className="category-card__name">{category.name}</span>
    </Link>
  );
}