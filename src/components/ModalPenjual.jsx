import React from 'react';

const PenjualanModal = ({
  isOpen,
  onClose,
  onAddPenjualan,
  penjualanData,
  setPenjualanData,
  sparepartMap,
  customerMap,
}) => {
  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPenjualanData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-base-100 rounded-lg p-6 w-11/12 md:w-1/3">
        <h2 className="text-2xl font-semibold mb-4">Add New Sale</h2>
        
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Customer</span>
          </label>
          <select
            name="id_customer"
            value={penjualanData.id_customer}
            onChange={handleInputChange}
            className="select select-bordered w-full"
          >
            <option value="">Select Customer</option>
            {Object.entries(customerMap).map(([id, name]) => (
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
            value={penjualanData.id_sparepart}
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
            value={penjualanData.jumlah}
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
            value={penjualanData.tanggal}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="mb-4">
          <label className="label">
            <span className="label-text">Metode Pembayaran</span>
          </label>
          <select
            name="metode_pembayaran"
            value={penjualanData.metode_pembayaran}
            onChange={handleInputChange}
            className="select select-bordered w-full"
          >
            <option value="Tunai">Tunai</option>
            <option value="Kredit">Kredit</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 btn btn-error"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onAddPenjualan(penjualanData);
              onClose();
            }}
            className="btn btn-primary"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenjualanModal;