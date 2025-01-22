import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_Source } from '../global/Apisource';
import { motion } from 'framer-motion';
import { FaUser , FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import PemasokModal from '../components/ModalPemasok'; // Import the modal component
import format from 'date-fns/format';

export const Pemasok = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [pemasokData, setPemasokData] = useState({
    nama_pemasok: '',
    alamat: '',
    telepon: '',
    email: '',
  });

  const queryClient = useQueryClient();

  // Fetch suppliers using useQuery
  const { data: pemasokList = [], isLoading, isError, error } = useQuery({
    queryKey: ['pemasok'],
    queryFn: API_Source.getPemasok,
  });

  // Function to add a new supplier using useMutation
  const mutation = useMutation({
    mutationFn: API_Source.postPemasok,
    onSuccess: () => {
      queryClient.invalidateQueries(['pemasok']); // Refresh the list after adding
      setPemasokData({
        nama_pemasok: '',
        alamat: '',
        telepon: '',
        email: '',
      });
    },
    onError: (error) => {
      console.error('Error adding supplier:', error);
    },
  });

  // Function to handle adding a new supplier
  const handleAddPemasok = async (data) => {
    try {
      await mutation.mutateAsync({
        nama_pemasok: data.nama_pemasok,
        alamat: data.alamat,
        telepon: data.telepon,
        email: data.email,
      });
    } catch (error) {
      console.error('Failed to add supplier:', error);
    }
  };

  // Display loading or error if any
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">Error: {error.message}</div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">Daftar Pemasok</h1>
      {pemasokList.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>Tidak ada Pemasok yang tersedia.</p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
          >
            Add Supplier
          </button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {pemasokList.map((pemasok) => (
            <motion.div
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col transition-transform transform"
              key={pemasok.id_pemasok}
            >
              <div className="flex items-center mb-2">
                <FaUser  className="text-blue-500 mr-2" size={24} />
                <h2 className="text-xl font-semibold">{pemasok.nama_pemasok}</h2>
              </div>
              <div className="flex items-center mt-2">
                <FaMapMarkerAlt className="text-gray-500 mr-1" />
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
              <p className="text-sm text-gray-500">
                Dibuat Pada: {format(new Date(pemasok.created_at), 'dd/MM/yyyy')}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="mt-6">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
        >
          Add Supplier
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