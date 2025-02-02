import {
  Login,
  Signup,
  Kategori,
  Pemasok,
  Customer,
  Pembelian,
  Penjualan,
  Sparepart,
  DetailSparepart,
  DetailPenjualan,
  DetailKategori,
  DetailPembelian,
  HistoryPenjualan,
  HistoryPembelian,
  Profil
} from './pages';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './pages/Header'; // Menggunakan Header sebagai navigasi utama
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import Footer from './pages/Footer';

const App = () => {
  const queryClient = new QueryClient();

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="flex flex-col h-screen">
            <Header /> {/* Header sebagai navigasi utama */}
            <div className="container mx-auto p-4 flex-grow">
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/user/signup" element={<Signup />} />
                  <Route path="/user/login" element={<Login />} />

                  {/* Rute yang dilindungi */}
                  <Route
                    path="/kategori"
                    element={
                      <ProtectedRoute>
                        <Kategori />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/kategori/:id"
                    element={
                      <ProtectedRoute>
                        <DetailKategori />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/sparepart"
                    element={
                      <ProtectedRoute>
                        <Sparepart />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/sparepart/:id"
                    element={
                      <ProtectedRoute>
                        <DetailSparepart />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pemasok"
                    element={
                      <ProtectedRoute>
                        <Pemasok />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer"
                    element={
                      <ProtectedRoute>
                        <Customer />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pembelian"
                    element={
                      <ProtectedRoute>
                        <Pembelian />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pembelian/:id"
                    element={
                      <ProtectedRoute>
                        <DetailPembelian />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/penjualan"
                    element={
                      <ProtectedRoute>
                        <Penjualan />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/penjualan/:id"
                    element={
                      <ProtectedRoute>
                        <DetailPenjualan />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/historypenjualan"
                    element={
                      <ProtectedRoute>
                        <HistoryPenjualan />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/historypembelian"
                    element={
                      <ProtectedRoute>
                        <HistoryPembelian />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/user/:id"
                    element={
                      <ProtectedRoute>
                        <Profil />
                      </ProtectedRoute>
                    }
                  />
                  {/* Rute untuk autentikasi Google */}
                  <Route path="/user/auth/google" element={<Login />} /> {/* Ganti dengan komponen yang sesuai */}
                </Routes>
              </main>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;