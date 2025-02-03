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
      <div className="bg-base-100 rounded-lg p-6 w-11/12 md:w-1/3">
        <h2 className="text-2xl font-semibold mb-4">Add New Purchase</h2>

        <div className="mb-4">
          <label className="label">
            <span className="label-text">Pemasok</span>
          </label>
          <select
            name="id_pemasok"
            value={pembelianData.id_pemasok}
            onChange={handleInputChange}
            className="select select-bordered w-full"
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
          <label className="label">
            <span className="label-text">Sparepart</span>
          </label>
          <select
            name="id_sparepart"
            value={pembelianData.id_sparepart}
            onChange={handleInputChange}
            className="select select-bordered w-full"
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
          <label className="label">
            <span className="label-text">Jumlah</span>
          </label>
          <input
            type="number"
            name="jumlah"
            value={pembelianData.jumlah}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter quantity"
          />
        </div>

        <div className="mb-4">
          <label className="label">
            <span className="label-text">Tanggal</span>
          </label>
          <input
            type="date"
            name="tanggal"
            value={pembelianData.tanggal}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="mb-4">
          <label className="label">
            <span className="label-text">Status</span>
          </label>
          <select
            name="status"
            value={pembelianData.status}
            onChange={handleInputChange}
            className="select select-bordered w-full"
          >
            <option value="Pending">Pending</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => {
              onAddPembelian(pembelianData);
              console.log('onAddPembelian: ', pembelianData);
              onClose();
            }}
            className="btn btn-primary"
          >
            Add Purchase
          </button>
          <button onClick={onClose} className="btn btn-error">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PembelianModal;
