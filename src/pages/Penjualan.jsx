import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';
import { formatPrice } from '../components/Rupiah';
import PenjualanModal from '../components/ModalPenjual'; // Import modal
import format from 'date-fns/format';

export const Penjualan = () => {
  const [penjualanList, setPenjualanList] = useState([]); // Initialize as an empty array
  const [customerMap, setCustomerMap] = useState({});
  const [sparepartMap, setSparepartMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [penjualanData, setPenjualanData] = useState({
    id_sparepart: '',
    id_customer: '',
    tanggal: '',
    jumlah: '',
    metode_pembayaran: 'Tunai', // Default payment method
  });

  const fetchData = async () => {
    try {
      const [penjualanData, customerData, sparepartData] = await Promise.all([
        API_Source.getPenjualan(),
        API_Source.getCustomer(),
        API_Source.getSparepart(),
      ]);
      setPenjualanList(penjualanData || []); // Ensure we set it to an empty array if null

      // Create a map of Customer ID to Customer Name
      const customerMapping = {};
      customerData.forEach((customer) => {
        customerMapping[customer.id_customer] = customer.nama_customer;
      });
      setCustomerMap(customerMapping);

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

  const handleAddPenjualan = async (data) => {
    console.log('Adding sale:', data);
    try {
      const newPenjualan = await API_Source.postPenjualan(
        data.id_sparepart,
        data.id_customer,
        data.tanggal,
        data.jumlah,
        data.metode_pembayaran
      );
      console.log('New Sale added:', newPenjualan);
      fetchData(); // Refresh the list after adding
      setPenjualanData({
        id_sparepart: '',
        id_customer: '',
        tanggal: '',
        jumlah: '',
        metode_pembayaran: 'Tunai', // Reset to default
      });
    } catch (error) {
      console.error('Error adding sale:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!penjualanList || penjualanList.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">Daftar Penjualan</h1>
        <div className="text-center text-gray-500">
          <p>Tidak ada penjualan yang tersedia.</p>
          <button
            onClick={() => {
              console.log('Opening modal...');
              setModalOpen(true);
            }}
            className="mt-4 bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
          >
            Add Sale
          </button>
        </div>
        <PenjualanModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onAddPenjualan={handleAddPenjualan}
          penjualanData={penjualanData}
          setPenjualanData={setPenjualanData}
          sparepartMap={sparepartMap}
          customerMap={customerMap}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">Daftar Penjualan</h1>
      <motion.ul
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {penjualanList.map((penjualan) => (
          <motion.li
            key={penjualan.id_penjualan}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col"
          >
            <FaShoppingCart className="text-blue-500 mb-2" size={30} />
            <div className="flex items-center mt-2">
              <FaUser className="text-gray-500 mr-1" />
              <p className="text-xl font-semibold">
                Nama Customer: {customerMap[penjualan.id_customer] || 'Unknown Customer'}
              </p>
            </div>
            <div className="flex items-center mt-2">
              <FaUser className="text-gray-500 mr-1" />
              <p className="text-xl font-semibold">
                Nama Sparepart: {sparepartMap[penjualan.id_sparepart] || 'Unknown Sparepart'}
              </p>
            </div>
            <div className="flex items-center mt-2">
              <FaShoppingCart className="text-gray-500 mr-1" />
              <p className="text-lg ">Jumlah: {penjualan.jumlah}</p>
            </div>
            <div className="flex items-center mt-2">
              <FaCalendarAlt className="text-gray-500 mr-1" />
              <p>Tanggal: {format(new Date(penjualan.tanggal), 'dd/MM/yyyy')}</p>
            </div>
            <div className="flex items-center mt-2">
              <FaMoneyBillWave className="text-gray-500 mr-1" />
              <p className="text-base font-bold text-green-600">
                Total Harga: {formatPrice(penjualan.total_harga)}
              </p>
            </div>
            <Link
              to={`/penjualan/${penjualan.id_penjualan}`}
              className="flex justify-center mt-4 text-blue-500 hover:underline text-lg"
            >
              Detail
            </Link>
          </motion.li>
        ))}
      </motion.ul>
      <div className="mt-6">
        <button
          onClick={() => {
            console.log('Opening modal...');
            setModalOpen(true);
          }}
          className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
        >
          Add Sale
        </button>
      </div>
      <PenjualanModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddPenjualan={handleAddPenjualan}
        penjualanData={penjualanData}
        setPenjualanData={setPenjualanData}
        sparepartMap={sparepartMap}
        customerMap={customerMap}
      />
    </div>
  );
};
