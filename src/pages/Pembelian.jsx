import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaUser, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';
import { formatPrice } from '../components/Rupiah';
import PembelianModal from '../components/ModalPembelian'; // Import the modal component
import format from 'date-fns/format';
import { Link } from 'react-router-dom';

export const Pembelian = () => {
  const [pembelianList, setPembelianList] = useState([]); // Ensure this is initialized as an empty array
  const [pemasokMap, setPemasokMap] = useState({});
  const [sparepartMap, setSparepartMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pembelianData, setPembelianData] = useState({
    id_sparepart: '',
    id_pemasok: '',
    tanggal: '',
    jumlah: '',
    status: 'Pending', // Default status
  });

  const fetchData = async () => {
    try {
      const [pembelianData, pemasokData, sparepartData] = await Promise.all([
        API_Source.getPembelian(),
        API_Source.getPemasok(),
        API_Source.getSparepart(),
      ]);
      setPembelianList(pembelianData || []); // Ensure we set it to an empty array if null
      // Create a map of Supplier ID to Supplier Name
      const pemasokMapping = {};
      pemasokData.forEach((pemasok) => {
        pemasokMapping[pemasok.id_pemasok] = pemasok.nama_pemasok;
      });
      setPemasokMap(pemasokMapping);

      // Create a map of Sparepart ID to Sparepart Name
      const sparepartMapping = {};
      sparepartData.forEach((sparepart) => {
        sparepartMapping[sparepart.id_sparepart] = sparepart.nama_sparepart;
      });
      setSparepartMap(sparepartMapping);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddPembelian = async (data) => {
    console.log('Adding purchase:', data);
    try {
      const newPembelian = await API_Source.postPembelian(
        data.id_sparepart,
        data.id_pemasok,
        data.tanggal,
        data.jumlah,
        data.status
      );
      console.log('New Purchase added:', newPembelian);
      fetchData(); // Refresh the list after adding
      setPembelianData({
        id_sparepart: '',
        id_pemasok: '',
        tanggal: '',
        jumlah: '',
        status: 'Pending',
      });
    } catch (error) {
      console.error('Error adding purchase:', error.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>
    );
  }
  //tampilkan halaman tidak ditemukan jika tidak ada data


    return (
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">Daftar Pembelian</h1>
        {pembelianList && pembelianList.length > 0 ? (
          <motion.ul
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {pembelianList.map((pembelian) => (
              <motion.li
                key={pembelian.id_pembelian}
                className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-start"
              >
                <FaShoppingCart className="text-blue-500 mb-2" size={30} />
                <div className="flex items-center mt-2">
                  <FaUser className="text-gray-500 mr-1" />
                  <p className="text-xl font-semibold">
                    Nama Pemasok: {pemasokMap[pembelian.id_pemasok] || 'Unknown Pemasok'}
                  </p>
                </div>
                <div className="flex items-center mt-2">
                  <FaUser className="text-gray-500 mr-1" />
                  <p className="text-xl font-semibold">
                    Nama Sparepart: {sparepartMap[pembelian.id_sparepart] || 'Unknown Sparepart'}
                  </p>
                </div>
                <div className="flex items-center mt-2">
                  <FaUser className="text-gray-500 mr-1" />
                  <p className="text-lg ">Jumlah: {pembelian.jumlah}</p>
                </div>
                <div className="flex items-center mt-2">
                  <FaCalendarAlt className="text-gray-500 mr-1" />
                  <p>Tanggal: {format(new Date(pembelian.tanggal), 'dd/MM/yyyy')}</p>
                </div>
                <div className="flex items-center mt-2">
                  <FaMoneyBillWave className="text-gray-500 mr-1" />
                  <p className="text-lg font-bold text-green-600">
                    Total Harga: {formatPrice(pembelian.total_harga)}
                  </p>
                </div>
                <Link
                  to={`${pembelian.id_pembelian}`}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Detail
                </Link>
                {error && <div className="text-red-500">{error}</div>}
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <div className="text-center text-gray-500">
            <p>Tidak ada Pembelian yang tersedia.</p>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-4 bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
            >
              Add Purchase
            </button>
            {error && <div className="text-red-500">{error}</div>}
          </div>
        )}
        
        <div className="mt-6">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
          >
            Add Purchase
          </button>
        </div>
    
        <PembelianModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onAddPembelian={handleAddPembelian}
          pembelianData={pembelianData}
          setPembelianData={setPembelianData}
          sparepartMap={sparepartMap}
          pemasokMap={pemasokMap}
        />
      </div>
    );
    
};
