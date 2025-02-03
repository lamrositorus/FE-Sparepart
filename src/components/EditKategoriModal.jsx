// src/components/EditKategoriModal.js (Perbaikan Lengkap)
import React, { useEffect, useState } from 'react';

const EditKategoriModal = ({ isOpen, onClose, onUpdateKategori, kategoriData }) => {
  const [formData, setFormData] = useState({
    nama_kategori: '',
    deskripsi: '',
  });

  // Update form saat data kategori berubah
  useEffect(() => {
    if (kategoriData) {
      setFormData({
        nama_kategori: kategoriData.nama_kategori || '',
        deskripsi: kategoriData.deskripsi || '',
      });
    }
  }, [kategoriData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Kirim semua data termasuk ID
    onUpdateKategori({
      ...kategoriData,
      ...formData,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
              name="nama_kategori"
              value={formData.nama_kategori}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="label">
              <span className="label-text">Deskripsi</span>
            </label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditKategoriModal;
