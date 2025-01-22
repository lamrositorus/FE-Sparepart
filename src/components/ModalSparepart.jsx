import React from 'react';

const Modal = ({ isOpen, onClose, onAddSparepart, sparepartData, setSparepartData }) => {
  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSparepartData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3">
        <h2 className="text-2xl font-semibold mb-4">Add New Sparepart</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Nama Sparepart</label>
          <input
            type="text"
            name="namaSparepart"
            value={sparepartData.namaSparepart}
            onChange={handleInputChange}
            className="border rounded p-2 w-full"
            placeholder="Enter spare part name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Harga</label>
          <input
            type="number"
            name="harga"
            value={sparepartData.harga}
            onChange={handleInputChange}
            className="border rounded p-2 w-full"
            placeholder="Enter price"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Margin</label>
          <input
            type="number"
            name="margin"
            value={sparepartData.margin}
            onChange={handleInputChange}
            className="border rounded p-2 w-full"
            placeholder="Enter margin"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Stok</label>
          <input
            type="number"
            name="stok"
            value={sparepartData.stok}
            onChange={handleInputChange}
            className="border rounded p-2 w-full"
            placeholder="Enter stock quantity"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Deskripsi</label>
          <textarea
            name="deskripsi"
            value={sparepartData.deskripsi}
            onChange={handleInputChange}
            className="border rounded p-2 w-full"
            placeholder="Enter description"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Kategori</label>
          <select
  name="selectedKategori"
  value={sparepartData.selectedKategori}
  onChange={handleInputChange}
  className="border rounded p-2 w-full"
>
  <option value="">Select category</option>
  {(sparepartData.kategoriList || []).map((kategori) => (
    <option key={kategori.id_kategori} value={kategori.id_kategori}>
      {kategori.nama_kategori}
    </option>
  ))}
</select>

        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Pemasok</label>
          <select
  name="selectedPemasok"
  value={sparepartData.selectedPemasok}
  onChange={handleInputChange}
  className="border rounded p-2 w-full"
>
  <option value="">Select supplier</option>
  {(sparepartData.pemasokList || []).map((pemasok) => (
    <option key={pemasok.id_pemasok} value={pemasok.id_pemasok}>
      {pemasok.nama_pemasok}
    </option>
  ))}
</select>

        </div>
        <div className="flex justify-between">
          <button
            onClick={() => {
              onAddSparepart(sparepartData);
              onClose();
            }}
            className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
          >
            Add Sparepart
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-black rounded p-2 hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
