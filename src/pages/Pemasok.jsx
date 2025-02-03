import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { motion } from 'framer-motion';
import { FaUser, FaMapMarkedAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import PemasokModal from '../components/ModalPemasok'; // Import the modal component
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import {Alert} from 'antd'
export const Pemasok = () => {
  const [pemasokList, setPemasokList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [pemasokData, setPemasokData] = useState({
    id_pemasok: null,
    nama_pemasok: '',
    alamat: '',
    telepon: '',
    email: '',
  });

  // Fetch suppliers on component mount
  const fetchPemasok = async () => {
    setLoading(true);
    try {
      const data = await API_Source.getPemasok();
      setPemasokList(data || []); // Ensure we set it to an empty array if null
    } catch (err) {
      toast.error(err || 'Gagal mengambil data pemasok');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPemasok();
  }, []);

  // Function to add a new supplier
  const handleAddPemasok = async (data) => {
    try {
      await API_Source.postPemasok(data.nama_pemasok, data.alamat, data.telepon, data.email);

      // Reset form data
      setPemasokData({
        nama_pemasok: '',
        alamat: '',
        telepon: '',
        email: '',
      });

      // Refresh list
      await fetchPemasok();

      // Close modal first

      setModalOpen(false);

      // Show success toast after modal closes
      toast.success('Pemasok berhasil ditambahkan!');
    } catch (error) {
      toast.error(error || 'Gagal menambahkan pemasok');
    }
  };

  // Display loading or error if any
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
    <span className="loading loading-infinity loading-lg"></span>
  </div>
  }

  return (
    <div className="container mx-auto p-4">
      <ToastContainer /> {/* Add ToastContainer for toast notifications */}
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">Daftar Pemasok</h1>
      <div className="mt-6 mb-4">
        <button onClick={() => setModalOpen(true)} className="btn btn-primary">
          Tambah Pemasok
        </button>
      </div>
      {pemasokList.length === 0 ? (
                <Alert
                message="Tidak ada data"
                description="Belum ada data pembelian yang tersedia."
                type="info"
                showIcon
              />
      ) : (
        <motion.ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {pemasokList.map((pemasok) => (
            <motion.li
              key={pemasok.id_pemasok}
              className="bg-base-100 shadow-lg rounded-lg p-6 flex flex-col transition-transform transform hover:scale-105"
            >
              <FaUser className="text-blue-500 mb-2" size={30} />
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

export default Pemasok;
