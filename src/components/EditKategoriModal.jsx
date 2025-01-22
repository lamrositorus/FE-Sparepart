import React, { useState, useEffect } from 'react';

const EditKategoriModal = ({ isOpen, onClose, onUpdateKategori, kategoriData }) => {
  const [namaKategori, setNamaKategori] = useState('');
  const [deskripsi, setDeskripsi] = useState('');

  useEffect(() => {
    if (kategoriData) {
      setNamaKategori(kategoriData.nama_kategori);
      setDeskripsi(kategoriData.deskripsi);
    }
  }, [kategoriData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateKategori({ id: kategoriData.id_kategori, nama_kategori: namaKategori, deskripsi });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Kategori</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Nama Kategori</label>
            <input
              type="text"
              value={namaKategori}
              onChange={(e) => setNamaKategori(e.target.value)}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Deskripsi</label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-gray-300 text-black rounded p-2"
            >
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white rounded p-2">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditKategoriModal;
