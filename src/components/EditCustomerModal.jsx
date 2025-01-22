import React, { useEffect, useState } from 'react';

const EditCustomerModal = ({ isOpen, onClose, onUpdateCustomer, customerData }) => {
  const [namaCustomer, setNamaCustomer] = useState('');
  const [alamat, setAlamat] = useState('');
  const [telepon, setTelepon] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (customerData) {
      setNamaCustomer(customerData.nama_customer);
      setAlamat(customerData.alamat);
      setTelepon(customerData.telepon);
      setEmail(customerData.email);
    }
  }, [customerData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateCustomer(customerData.id_customer, namaCustomer, alamat, telepon, email);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3">
        <h2 className="text-2xl font-semibold mb-4">Edit Customer</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nama Customer</label>
            <input
              type="text"
              value={namaCustomer}
              onChange={(e) => setNamaCustomer(e.target.value)}
              className="border rounded p-2 w-full"
              placeholder="Enter customer name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Alamat</label>
            <input
              type="text"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              className="border rounded p-2 w-full"
              placeholder="Enter address"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Telepon</label>
            <input
              type="text"
              value={telepon}
              onChange={(e) => setTelepon(e.target.value)}
              className="border rounded p-2 w-full"
              placeholder="Enter phone number"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded p-2 w-full"
              placeholder="Enter email"
              required
            />
          </div>
          <div className="flex justify-between">
            <button type="submit" className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600">
              Update Customer
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black rounded p-2 hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomerModal;
