import { Outlet } from 'react-router-dom';
// import { Sidebar } from '../../components/layout/Sidebar';
// import type { SidebarItem } from '../../components/layout/Sidebar';
import '../AdminLayout/styles.css'; // on réutilise le même CSS de layout à deux colonnes
import { Sidebar, type SidebarItem } from '../../components/Layout/Sidebar';

const PRODUCER_NAV: SidebarItem[] = [
  { label: 'Dashboard', to: '/producer/dashboard', icon: '📊' },
  { label: 'Mes exploitations', to: '/producer/farms', icon: '🚜' },
  { label: 'Mes produits', to: '/producer/products', icon: '🥬' },
  { label: 'Mes commandes', to: '/producer/orders', icon: '🧾' },
];

export function ProducerLayout() {
  return (
    <div className="admin-layout">
      <Sidebar title="Espace producteur" items={PRODUCER_NAV} />
      <div className="admin-layout__content">
        <Outlet />
      </div>
    </div>
  );
}