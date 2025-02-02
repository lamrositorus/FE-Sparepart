// src/components/CustomerModal.js
import React from 'react';

const CustomerModal = ({ isOpen, onClose, onAddCustomer, customerData, setCustomerData }) => {
  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-base-100 rounded-lg p-6 w-11/12 md:w-1/3">
        <h2 className="text-2xl font-semibold mb-4">Add New Customer</h2>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Nama Pelanggan</span>
          </label>
          <input
            type="text"
            name="nama_customer"
            value={customerData.nama_customer}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter customer name"
          />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Alamat</span>
          </label>
          <input
            type="text"
            name="alamat"
            value={customerData.alamat}
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
            value={customerData.telepon}
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
            value={customerData.email}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter email"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => {
              onAddCustomer(customerData);
              onClose();
            }}
            className="btn btn-primary"
          >
            Add Customer
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

export default CustomerModal;