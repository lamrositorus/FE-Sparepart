// src/components/PembelianModal.js
import React from 'react';

const PembelianModal = ({
  isOpen,
  onClose,
  onAddPembelian,
  pembelianData,
  setPembelianData,
  sparepartMap,
  pemasokMap,
}) => {
  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPembelianData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3">
        <h2 className="text-2xl font-semibold mb-4">Add New Purchase</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Pemasok</label>
          <select
            name="id_pemasok"
            value={pembelianData.id_pemasok}
            onChange={handleInputChange}
            className="border rounded p-2 w-full"
          >
            <option value="">Select Supplier</option>
            {Object.entries(pemasokMap).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Sparepart</label>
          <select
            name="id_sparepart"
            value={pembelianData.id_sparepart}
            onChange={handleInputChange}
            className="border rounded p-2 w-full"
          >
            <option value="">Select Sparepart</option>
            {Object.entries(sparepartMap).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Jumlah</label>
          <input
            type="number"
            name="jumlah"
            value={pembelianData.jumlah}
            onChange={handleInputChange}
            className="border rounded p-2 w-full"
            placeholder="Enter quantity"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Tanggal</label>
          <input
            type="date"
            name="tanggal"
            value={pembelianData.tanggal}
            onChange={handleInputChange}
            className="border rounded p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Status</label>
          <select
            name="status"
            value={pembelianData.status}
            onChange={handleInputChange}
            className="border rounded p-2 w-full"
          >
            <option value="Pending">Pending</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => {
              onAddPembelian(pembelianData);
              console.log('onAddpembelian: ',pembelianData);
              onClose();
            }}
            className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
          >
            Add Purchase
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

export default PembelianModal;
