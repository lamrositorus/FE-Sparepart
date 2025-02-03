import React from 'react';

const KategoriModal = ({ isOpen, onClose, onAddKategori, kategoriData, setKategoriData }) => {
  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setKategoriData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-base-100 rounded-lg p-6 w-11/12 md:w-1/3">
        <h2 className="text-2xl font-semibold mb-4">Add New Kategori</h2>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Nama Kategori</span>
          </label>
          <input
            type="text"
            name="nama_kategori"
            value={kategoriData.nama_kategori}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter category name"
          />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Deskripsi</span>
          </label>
          <textarea
            name="deskripsi"
            value={kategoriData.deskripsi}
            onChange={handleInputChange}
            className="textarea textarea-bordered w-full"
            placeholder="Enter description"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => {
              onAddKategori(kategoriData);
              onClose();
            }}
            className="btn btn-primary"
          >
            Add Kategori
          </button>
          <button onClick={onClose} className="btn btn-error">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default KategoriModal;
