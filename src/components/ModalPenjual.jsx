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
      <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3">
        <h2 className="text-2xl font-semibold mb-4">Add New Sale</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Customer</label>
          <select
            name="id_customer"
            value={penjualanData.id_customer}
            onChange={handleInputChange}
            className="border rounded p-2 w-full"
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
          <label className="block text-gray-700">Sparepart</label>
          <select
            name="id_sparepart"
            value={penjualanData.id_sparepart}
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
            value={penjualanData.jumlah}
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
            value={penjualanData.tanggal}
            onChange={handleInputChange}
            className="border rounded p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Metode Pembayaran</label>
          <select
            name="metode_pembayaran"
            value={penjualanData.metode_pembayaran}
            onChange={handleInputChange}
            className="border rounded p-2 w-full"
          >
            <option value="Tunai">Tunai</option>
            <option value="Kredit">Kredit</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 bg-gray-300 hover:bg-gray-400 text-black rounded p-2"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onAddPenjualan(penjualanData);
              onClose();
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded p-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenjualanModal;
