// src/pages/Pemasok.js
import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { motion } from 'framer-motion';
import { FaUser , FaMapMarkedAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import PemasokModal from '../components/ModalPemasok'; // Import the modal component
import Swal from 'sweetalert2'; // Import SweetAlert

export const Pemasok = () => {
  const [pemasokList, setPemasokList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pemasokData, setPemasokData] = useState({
    id_pemasok: null,
    nama_pemasok: '',
    alamat: '',
    telepon: '',
    email: '',
  });

  // Function to fetch suppliers
  const fetchPemasok = async () => {
    try {
      const data = await API_Source.getPemasok();
      setPemasokList(data || []); // Ensure we set it to an empty array if null
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch suppliers on component mount
  useEffect(() => {
    fetchPemasok();
  }, []);

  // Function to add a new supplier
  const handleAddPemasok = async (data) => {
    try {
      const newPemasok = await API_Source.postPemasok(
        data.nama_pemasok,
        data.alamat,
        data.telepon,
        data.email
      );
      console.log('New Supplier added:', newPemasok);
      fetchPemasok(); // Refresh the list after adding
      setPemasokData({
        id_pemasok: null,
        nama_pemasok: '',
        alamat: '',
        telepon: '',
        email: '',
      });

      // Show success alert
      Swal.fire({
        icon: 'success',
        title: 'Pemasok Ditambahkan',
        text: 'Pemasok baru berhasil ditambahkan!',
      });
    } catch (error) {
      console.error('Error adding supplier:', error);
      // Show error alert
      Swal.fire({icon: 'error', title: 'Gagal Menambahkan Pemasok', text: error});
    }
  };

  // Display loading or error if any
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">Daftar Pemasok</h1>
      {pemasokList.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>Tidak ada Pemasok yang tersedia.</p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
          >
            Tambah Pemasok
          </button>
        </div>
      ) : (
        <motion.ul
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {pemasokList.map((pemasok) => (
            <motion.li
              key={pemasok.id_pemasok}
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col transition-transform transform"
            >
              <FaUser  className="text-blue-500 mb-2" size={30} />
              <h2 className="text-xl font-semibold">{pemasok.nama_pemasok}</h2>
              <div className="flex items-center mt-2">
                <FaMapMarkedAlt className="text-gray-500 mr-1" />
                <p>Alamat: {pemasok.alamat}</p>
              </div>
              <div className="flex items-center mt-2">
                <FaPhone className="text-gray-500 mr-1" />
                <p>Telepon: {pemasok.telepon}</p>
              </div>
              <div className="flex items-center mt-2">
                <FaEnvelope className="text-gray-500 mr-1" />
                <p>Email: {pemasok.email}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      )}

      <div className="mt-6">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
        >
          Tambah Pemasok
        </button>
      </div>

      <PemasokModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddPemasok={handleAddPemasok}
        pemasokData={pemasokData}
        setPemasokData={setPemasokData}
      />
    </div>
  );
};

