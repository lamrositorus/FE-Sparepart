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
  HistoryPembelian
} from './pages';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './pages/Header';

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Header />
        <div className="container mx-auto p-4">
          {' '}
          {/* Container untuk konten */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/kategori" element={<Kategori />} />
            <Route path="/user/signup" element={<Signup />} />
            <Route path="/user/login" element={<Login />} />
            <Route path="/user/signup" element={<Signup />} />
            <Route path="/kategori" element={<Kategori />} />
            <Route path="/kategori/:id" element={<DetailKategori />} />
            <Route path="/sparepart" element={<Sparepart />} />
            <Route path="/sparepart/:id" element={<DetailSparepart />} />
            <Route path="/pemasok" element={<Pemasok />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/pembelian" element={<Pembelian />} />
            <Route path="/pembelian/:id" element={<DetailPembelian />} />
            <Route path="/penjualan" element={<Penjualan />} />
            <Route path="/penjualan/:id" element={<DetailPenjualan />} />
            <Route path="/historypenjualan" element={<HistoryPenjualan />} />
            <Route path="/historypembelian" element={<HistoryPembelian />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
