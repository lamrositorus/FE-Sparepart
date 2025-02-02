import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { motion } from 'framer-motion';
import { FaTags } from 'react-icons/fa';
import KategoriModal from '../components/ModalKategori';
import EditKategoriModal from '../components/EditKategoriModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { useQuery } from '@tanstack/react-query';
import format from 'date-fns/format';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast notifications

export const Kategori = () => {
  const [kategoriData, setKategoriData] = useState({
    nama_kategori: '',
    deskripsi: '',
  });
  const [editKategoriData, setEditKategoriData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [kategoriToDelete, setKategoriToDelete] = useState(null);

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
      console.error('Error fetching categories:', kategoriError);
      toast.error(kategoriError.message || 'Gagal memuat kategori.'); // Use toast for error
    }
  }, [kategoriError]);

  const handleAddKategori = () => {
    setActionType('add');
    setConfirmModalOpen(true);
  };

  const handleUpdateKategori = () => {
    setActionType('update');
    setConfirmModalOpen(true);
  };

  const confirmAddKategori = async () => {
    try {
      await API_Source.postKategori(kategoriData.nama_kategori, kategoriData.deskripsi);
      toast.success('Kategori berhasil ditambahkan.'); // Use toast for success
      setKategoriData({ nama_kategori: '', deskripsi: '' });
      setConfirmModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error(error || 'Gagal menambahkan kategori.'); // Use toast for error
    }
  };

  const confirmUpdateKategori = async () => {
    try {
      await API_Source.updatedKategori(editKategoriData.id_kategori, editKategoriData.nama_kategori, editKategoriData.deskripsi);
      toast.success('Kategori berhasil diperbarui.'); // Use toast for success
      setEditModalOpen(false);
      setConfirmModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error(error || 'Gagal memperbarui kategori.'); // Use toast for error
    }
  };

  const handleDeleteKategori = async () => {
    try {
      await API_Source.deleteKategori(kategoriToDelete.id_kategori);
      toast.success('Kategori berhasil dihapus.'); // Use toast for success
      setConfirmModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error || 'Gagal menghapus kategori.'); // Use toast for error
    }
  };

  const openAddModal = () => {
    setModalOpen(true);
  };

  const openEditModal = (kategori) => {
    setEditKategoriData(kategori);
    setEditModalOpen(true);
  };

  const openDeleteModal = (kategori) => {
    setKategoriToDelete(kategori);
    setActionType('delete');
    setConfirmModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-blue-600">Kategori</h1>
        <button className="btn btn-primary text-white" onClick={openAddModal}>
          Tambah Kategori
        </button>
      </div>

      {kategoriList.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {kategoriList.map((kategori) => (
            <motion.div
              className="card bg-base-100 shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300"
              key={kategori.id_kategori}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="flex items-center mb-2">
                <FaTags className="text-blue-500 mr-2" size={24} />
                <h2 className="text-xl font-semibold">{kategori.nama_kategori}</h2>
              </div>
              <p className="text-gray-600">{kategori.deskripsi}</p>
              <p className="text-sm text-gray-500">Dibuat Pada: {format(new Date(kategori.created_at), 'dd/MM/yyyy')}</p>
              <div className="flex justify-between mt-4">
                <Link to={`/kategori/${kategori.id_kategori}`} className="link link-primary text-sm">
                  Detail
                </Link>
                <button
                  onClick={() => openEditModal(kategori)}
                  className="link link-error text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(kategori)}
                  className="link link-error text-sm"
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center text-center">
          <img src="/empty-state.svg" alt="No data" className="w-48 h-48 mb-4" />
          <h2 className="text-2xl font-bold">Belum ada data kategori.</h2>
        </div>
      )}
      <KategoriModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddKategori={handleAddKategori} // This will just open the modal
        kategoriData={kategoriData}
        setKategoriData={setKategoriData}
      />
      <EditKategoriModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdateKategori={handleUpdateKategori} // This will just open the modal
        kategoriData={editKategoriData}
      />
      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={actionType === 'add' ? confirmAddKategori : actionType === 'update' ? confirmUpdateKategori : handleDeleteKategori}
        message={actionType === 'delete' ? `Apakah Anda yakin ingin menghapus kategori "${kategoriToDelete?.nama_kategori}"?` : 
          actionType === 'update' ? 
          `Apakah Anda yakin ingin memperbarui kategori "${editKategoriData?.nama_kategori}"?` : 
          `Apakah Anda yakin ingin menambahkan kategori "${kategoriData.nama_kategori}"?`}
      />
      <ToastContainer /> {/* Add ToastContainer to render the toasts */}
    </div>
  );
};