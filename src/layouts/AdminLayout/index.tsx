import { Outlet } from 'react-router-dom';
// import { Sidebar } from '../../components/layout/Sidebar';
// import type { SidebarItem } from '../../components/layout/Sidebar';
import './styles.css';
import { Sidebar, type SidebarItem } from '../../components/Layout/Sidebar';

const ADMIN_NAV: SidebarItem[] = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: '📊' },
  { label: 'Producteurs', to: '/admin/producers', icon: '👤' },
  { label: 'Catégories', to: '/admin/categories', icon: '🗂️' },
  { label: 'Produits', to: '/admin/products', icon: '📦' },
  { label: 'Commandes', to: '/admin/orders', icon: '🧾' },
];

export function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar title="Administration" items={ADMIN_NAV} />
      <div className="admin-layout__content">
        <Outlet />
      </div>
    </div>
  );
}