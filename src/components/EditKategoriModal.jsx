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
      <div className="bg-base-100 p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
        <h2 className="text-xl font-bold mb-4">Edit Kategori</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="label">
              <span className="label-text">Nama Kategori</span>
            </label>
            <input
              type="text"
              value={namaKategori}
              onChange={(e) => setNamaKategori(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="label">
              <span className="label-text">Deskripsi</span>
            </label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="textarea textarea-bordered w-full"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-error mr-2"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditKategoriModal;