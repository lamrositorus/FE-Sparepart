// src/components/PemasokModal.js
import React, { useState } from 'react';

const PemasokModal = ({ isOpen, onClose, onAddPemasok, pemasokData, setPemasokData }) => {
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPemasokData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (
      !pemasokData.nama_pemasok ||
      !pemasokData.alamat ||
      !pemasokData.telepon ||
      !pemasokData.email
    ) {
      setError('All fields are required.');
      return;
    }

    setError(''); // Clear any previous error
    onAddPemasok(pemasokData);
    setPemasokData({ nama_pemasok: '', alamat: '', telepon: '', email: '' }); // Reset fields
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3">
        <h2 className="text-2xl font-semibold mb-4">Add New Supplier</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700">Nama Pemasok</label>
          <input
            type="text"
            name="nama_pemasok"
            value={pemasokData.nama_pemasok}
            onChange={handleInputChange}
            className="border rounded p-2 w-full"
            placeholder="Enter supplier name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Alamat</label>
          <input
            type="text"
            name="alamat"
            value={pemasokData.alamat}
            onChange={handleInputChange}
            className="border rounded p-2 w-full"
            placeholder="Enter address"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Telepon</label>
          <input
            type="text"
            name="telepon"
            value={pemasokData.telepon}
            onChange={handleInputChange}
            className="border rounded p-2 w-full"
            placeholder="Enter phone number"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={pemasokData.email}
            onChange={handleInputChange}
            className="border rounded p-2 w-full"
            placeholder="Enter email"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => {
              console.log('Submitted data:', pemasokData); // Log the submitted data
              onAddPemasok(pemasokData); // Ensure pemasokData is structured correctly
              onClose();
            }}
            className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
          >
            Add Supplier
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

export default PemasokModal;
