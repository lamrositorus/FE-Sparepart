// src/components/PemasokModal.js
import React, { useState } from 'react';

const PemasokModal = ({ isOpen, onClose, onAddPemasok, pemasokData, setPemasokData }) => {
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPemasokData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    // Basic validation
  e.preventDefault();
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
      <div className="bg-base-100 rounded-lg p-6 w-11/12 md:w-1/3">
        <h2 className="text-2xl font-semibold mb-4">Add New Supplier</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Nama Pemasok</span>
          </label>
          <input
            type="text"
            name="nama_pemasok"
            value={pemasokData.nama_pemasok}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter supplier name"
          />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Alamat</span>
          </label>
          <input
            type="text"
            name="alamat"
            value={pemasokData.alamat}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter address"
          />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Telepon</span>
          </label>
          <input
            type="text"
            name="telepon"
            value={pemasokData.telepon}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter phone number"
          />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            name="email"
            value={pemasokData.email}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter email"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
          >
            Add Supplier
          </button>
          <button
            onClick={onClose}
            className="btn btn-error"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PemasokModal;