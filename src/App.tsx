import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Layout/Navbar';
import { AppRoutes } from './Routes/AppRoutes';
import { Footer } from './components/Layout/Footer';

// import { AppRoutes } from './routes/AppRoutes';
// import { Navbar } from './components/layout/Navbar';
// import { Footer } from './components/layout/Footer';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <main style={{ minHeight: '70vh' }}>
            <AppRoutes />
          </main>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}