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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Alert } from 'antd';

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
  const [showAlert, setShowAlert] = useState(false); // State untuk alert

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
      toast.error(kategoriError || 'Gagal memuat kategori.');
      setShowAlert(true); // Tampilkan alert saat terjadi kesalahan
    } else {
      setShowAlert(false); // Sembunyikan alert jika tidak ada kesalahan
    }
  }, [kategoriError]);

  const handleAddKategori = () => {
    setActionType('add');
    setConfirmModalOpen(true);
  };

  const handleUpdateKategori = (updatedData) => {
    setEditKategoriData(updatedData);
    setActionType('update');
    setConfirmModalOpen(true);
  };

  const confirmAddKategori = async () => {
    try {
      await API_Source.postKategori(kategoriData.nama_kategori, kategoriData.deskripsi);
      toast.success('Kategori berhasil ditambahkan.');
      setKategoriData({ nama_kategori: '', deskripsi: '' });
      setConfirmModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error(error);
    }
  };

  const confirmUpdateKategori = async () => {
    try {
      if (!editKategoriData) {
        toast.error('Tidak ada data yang akan diupdate');
        return;
      }

      await API_Source.updatedKategori(
        editKategoriData.id_kategori,
        editKategoriData.nama_kategori,
        editKategoriData.deskripsi
      );

      toast.success('Kategori berhasil diperbarui!');
      setEditModalOpen(false);
      setConfirmModalOpen(false);
      refetch();
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDeleteKategori = async () => {
    try {
      await API_Source.deleteKategori(kategoriToDelete.id_kategori);
      toast.success('Kategori berhasil dihapus.');
      setConfirmModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error.message || 'Gagal menghapus kategori.');
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
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-center">Kategori</h1>
        <button className="btn btn-primary text-white mt-4 sm:mt-0" onClick={openAddModal}>
          Tambah Kategori
        </button>
      </div>
      {showAlert && ( // Tampilkan alert jika ada kesalahan
        <Alert
          message="Kesalahan"
          description="Gagal memuat kategori. Silakan coba lagi."
          type="error"
          showIcon
          closable
          onClose={() => setShowAlert(false)} // Sembunyikan alert saat ditutup
        />
      )}
      {kategoriList.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {kategoriList.map((kategori) => (
            <motion.div
              className="card bg-base-100 shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-shadow duration-300"
              key={kategori.id_kategori}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="flex items-center mb-2">
                <FaTags className="text-blue-500 mr-2" size={24} />
                <h2 className="text-lg sm:text-xl font-semibold">{kategori.nama_kategori}</h2>
              </div>
              <p className="text-gray-600">{kategori.deskripsi}</p>
              <p className="text-sm text-gray-500">
                Dibuat Pada: {format(new Date(kategori.created_at), 'dd/MM/yyyy')}
              </p>
              <div className="flex justify-between mt-4">
                <Link
                  to={`/kategori/${kategori.id_kategori}`}
                  className="link link-primary text-sm"
                >
                  Detail
                </Link>
                <button onClick={() => openEditModal(kategori)} className="link link-error text-sm">
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
          <Alert
            message="Tidak ada kategori"
            description="Belum ada kategori yang tersedia."
            type="info"
            showIcon
          />
        </div>
      )}
      <KategoriModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddKategori={handleAddKategori}
        kategoriData={kategoriData}
        setKategoriData={setKategoriData}
      />
      <EditKategoriModal
        key={editKategoriData?.id_kategori}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdateKategori={handleUpdateKategori}
        kategoriData={editKategoriData}
      />
      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={
          actionType === 'add'
            ? confirmAddKategori
            : actionType === 'update'
              ? confirmUpdateKategori
              : handleDeleteKategori
        }
        message={
          actionType === 'delete'
            ? `Apakah Anda yakin ingin menghapus kategori "${kategoriToDelete?.nama_kategori}"?`
            : actionType === 'update'
              ? `Apakah Anda yakin ingin memperbarui kategori "${editKategoriData?.nama_kategori}"?`
              : `Apakah Anda yakin ingin menambahkan kategori "${kategoriData.nama_kategori}"?`
        }
      />
      <ToastContainer />
    </div>
  );
};