import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { motion } from 'framer-motion';
import { FaTags } from 'react-icons/fa';
import KategoriModal from '../components/ModalKategori';
import EditKategoriModal from '../components/EditKategoriModal';
import { useQuery } from '@tanstack/react-query';
import format from 'date-fns/format';
import { Link } from 'react-router-dom';

export const Kategori = () => {
  const [kategoriData, setKategoriData] = useState({
    nama_kategori: '',
    deskripsi: '',
  });
  const [editKategoriData, setEditKategoriData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Fetch categories using TanStack Query
  const {
    data: kategoriList = [],
    error: kategoriError,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['kategori'],
    queryFn: API_Source.getKategori,
  });

  useEffect(() => {
    if (kategoriError) {
      console.error('Error fetching categories:', kategoriError.message);
    }
  }, [kategoriError]);

  const handleAddKategori = async (data) => {
    try {
      await API_Source.postKategori(data.nama_kategori, data.deskripsi);
      setKategoriData({ nama_kategori: '', deskripsi: '' });
      refetch();
    } catch (error) {
      console.error('Error adding category:', error.message);
    }
  };

  const handleUpdateKategori = async ({ id, nama_kategori, deskripsi }) => {
    try {
      await API_Source.updatedKategori(id, nama_kategori, deskripsi);
      alert('Category updated successfully!');
      setEditModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error updating category:', error.message);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">Kategori</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">Loading...</div>
      ) : kategoriList && kategoriList.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {kategoriList.map((kategori) => (
            <motion.div
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col"
              key={kategori.id_kategori}
            >
              <div className="flex items-center mb-2">
                <FaTags className="text-blue-500 mr-2" size={24} />
                <h2 className="text-xl font-semibold">{kategori.nama_kategori}</h2>
              </div>
              <p className="text-gray-600">{kategori.deskripsi}</p>
              <p className="text-sm text-gray-500">
                Dibuat Pada: {format(new Date(kategori.created_at), 'dd/MM/yyyy')}
              </p>
              <div className="flex justify-between mt-4">
                <Link
                  to={`/kategori/${kategori.id_kategori}`}
                  className="text-blue-500 hover:underline text-sm"
                >
                  Detail
                </Link>
                <button
                  onClick={() => {
                    setEditKategoriData(kategori);
                    setEditModalOpen(true);
                  }}
                  className="text-red-500 hover:underline text-sm"
                >
                  Edit
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Kategori</h1>
            <p className="text-gray-600">Belum ada data kategori.</p>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setModalOpen(true)}
            >
              Tambah Kategori
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setModalOpen(true)}
        className="mt-6 bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
      >
        Tambah Kategori
      </button>
      <KategoriModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddKategori={handleAddKategori}
        kategoriData={kategoriData}
        setKategoriData={setKategoriData}
      />
      <EditKategoriModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdateKategori={handleUpdateKategori}
        kategoriData={editKategoriData}
      />
      {kategoriError && <div className="text-red-500 mt-4">{kategoriError.message}</div>}
    </div>
  );
};


