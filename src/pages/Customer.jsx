import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { motion } from 'framer-motion';
import { FaUser, FaMapMarkedAlt, FaPhone, FaEnvelope, FaTrash, FaEdit } from 'react-icons/fa';
import CustomerModal from '../components/ModalCustomer';
import EditCustomerModal from '../components/EditCustomerModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Alert} from 'antd'
export const Customer = () => {
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [customerData, setCustomerData] = useState({
    id_customer: null,
    nama_customer: '',
    alamat: '',
    telepon: '',
    email: '',
  });

  const fetchCustomers = async () => {
    try {
      const data = await API_Source.getCustomer();
      setCustomerList(data || []);
    } catch (error) {
      toast.error(error || 'Failed to fetch customers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddCustomer = () => {
    setConfirmationOpen(true);
  };

  const confirmAddCustomer = async () => {
    try {
      await API_Source.postCustomer(
        customerData.nama_customer,
        customerData.alamat,
        customerData.telepon,
        customerData.email
      );
      fetchCustomers();
      setCustomerData({
        id_customer: null,
        nama_customer: '',
        alamat: '',
        telepon: '',
        email: '',
      });
      toast.success('Customer added successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to add customer. Please try again later.');
    } finally {
      setConfirmationOpen(false);
    }
  };

  const handleUpdateCustomer = async (id, nama_customer, alamat, telepon, email) => {
    try {
      await API_Source.updateCustomer(id, nama_customer, alamat, telepon, email);
      fetchCustomers();
      setEditModalOpen(false);
      setCustomerData({
        id_customer: null,
        nama_customer: '',
        alamat: '',
        telepon: '',
        email: '',
      });
      toast.success('Customer updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update customer. Please try again later.');
    }
  };

  const handleDeleteCustomer = (id) => {
    setActionType('delete');
    setConfirmationOpen(true);
    setCustomerData({ id_customer: id });
  };

  const confirmAction = async () => {
    if (actionType === 'delete') {
      try {
        await API_Source.deleteCustomer(customerData.id_customer);
        toast.success('Customer deleted successfully!');
        fetchCustomers();
      } catch (error) {
        toast.error(error || 'Failed to delete customer. Please try again later.');
      }
    }
    setConfirmationOpen(false);
  };

  const openEditModal = (customer) => {
    setCustomerData(customer);
    setEditModalOpen(true);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
    <span className="loading loading-infinity loading-lg"></span>
  </div>
  }

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h1 className="text-3xl sm:text-4xl font-bold text-center">Customer List</h1>
      <button className="btn btn-primary mb-4" onClick={() => setModalOpen(true)}>
        Add Customer
      </button>
      {customerList.length === 0 ? (
                <Alert
                message="Tidak ada data"
                description="Belum ada data pembelian yang tersedia."
                type="info"
                showIcon
              />
      ) : (
        <motion.ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {customerList.map((customer) => (
            <motion.li
              key={customer.id_customer}
              className="bg-base-100 shadow-lg rounded-lg p-6 flex flex-col transition-transform transform hover:scale-105"
            >
              <FaUser className="text-blue-500 mb-2" size={30} />
              <h2 className="text-xl font-semibold">{customer.nama_customer}</h2>
              <div className="flex items-center mt-2">
                <FaMapMarkedAlt className="text-gray-500 mr-1" />
                <p>Alamat: {customer.alamat}</p>
              </div>
              <div className="flex items-center mt-2">
                <FaPhone className="text-gray-500 mr-1" />
                <p>Telepon: {customer.telepon}</p>
              </div>
              <div className="flex items-center mt-2">
                <FaEnvelope className="text-gray-500 mr-1" />
                <p>Email: {customer.email}</p>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => openEditModal(customer)}
                  className="text-blue-500 hover:underline flex items-center"
                >
                  <FaEdit className="mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDeleteCustomer(customer.id_customer)}
                  className="text-red-500 hover:underline flex items-center"
                >
                  <FaTrash className="mr-1" /> Delete
                </button>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      )}

      <CustomerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddCustomer={confirmAddCustomer}
        customerData={customerData}
        setCustomerData={setCustomerData}
      />

      <EditCustomerModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setCustomerData({
            id_customer: null,
            nama_customer: '',
            alamat: '',
            telepon: '',
            email: '',
          });
        }}
        onUpdateCustomer={handleUpdateCustomer}
        customerData={customerData}
      />

      <ConfirmationModal
        isOpen={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={confirmAction}
        message={`Are you sure you want to ${actionType === 'delete' ? 'delete' : 'add'} this customer?`}
      />
    </div>
  );
};

export default Customer;
