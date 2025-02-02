// src/pages/Customer.js
import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { motion } from 'framer-motion';
import { FaUser , FaMapMarkedAlt, FaPhone, FaEnvelope, FaTrash, FaEdit } from 'react-icons/fa';
import CustomerModal from '../components/ModalCustomer'; // Import the modal component
import EditCustomerModal from '../components/EditCustomerModal'; // Import the edit modal component
import ConfirmationModal from '../components/ConfirmationModal'; // Import the confirmation modal
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import Swal from 'sweetalert2'; // Import SweetAlert2
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

export const Customer = () => {
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false); // State for edit modal
  const [confirmationOpen, setConfirmationOpen] = useState(false); // State for confirmation modal
  const [actionType, setActionType] = useState(null); // Track action type (delete or update)
  const [customerData, setCustomerData] = useState({
    id_customer: null,
    nama_customer: '',
    alamat: '',
    telepon: '',
    email: '',
  });

  // Function to fetch customers
  const fetchCustomers = async () => {
    try {
      const data = await API_Source.getCustomer();
      setCustomerList(data || []); // Ensure we set it to an empty array if null
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to fetch customers. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Function to handle adding a new customer
  const handleAddCustomer = () => {
    setConfirmationOpen(true); // Open confirmation modal
  };

  // Function to confirm adding a customer
  const confirmAddCustomer = async () => {
    try {
      const newCustomer = await API_Source.postCustomer(
        customerData.nama_customer,
        customerData.alamat,
        customerData.telepon,
        customerData.email
      );
      console.log('New Customer added:', newCustomer);
      fetchCustomers(); // Refresh the list after adding
      setCustomerData({
        id_customer: null,
        nama_customer: '',
        alamat: '',
        telepon: '',
        email: '',
      });
      toast.success('Customer added successfully!'); // Show success toast
    } catch (error) {
      toast.error(error.message || 'Failed to add customer. Please try again later.'); // Show error toast
    } finally {
      setConfirmationOpen(false); // Close confirmation modal
    }
  };

  // Function to update a customer
  const handleUpdateCustomer = async (id, nama_customer, alamat, telepon, email) => {
    try {
      await API_Source.updateCustomer(id, nama_customer, alamat, telepon, email);
      console.log('Customer updated:', id);
      fetchCustomers(); // Refresh the list after updating
      setEditModalOpen(false); // Close the edit modal
      setCustomerData({
        id_customer: null,
        nama_customer: '',
        alamat: '',
        telepon: '',
        email: '',
      });
      toast.success('Customer updated successfully!'); // Show success toast
    } catch (error) {
      toast.error(error.message || 'Failed to update customer. Please try again later.'); // Show error toast
    }
  };

  // Function to delete a customer
  const handleDeleteCustomer = (id) => {
    setActionType('delete');
    setConfirmationOpen(true);
    setCustomerData({ id_customer: id }); // Set customer ID for deletion
  };

  const confirmAction = async () => {
    if (actionType === 'delete') {
      try {
        await API_Source.deleteCustomer(customerData.id_customer);
        toast.success('Customer deleted successfully!');
        fetchCustomers(); // Refresh the list after deletion
      } catch (error) {
        toast.error(error.message || 'Failed to delete customer. Please try again later.'); // Show error toast
      }
    }
    setConfirmationOpen(false);
  };

  // Function to open the edit modal
  const openEditModal = (customer) => {
    setCustomerData(customer);
    setEditModalOpen(true);
  };

  // Display loading or error if any
  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Customer List</h1>
      <button className="btn btn-primary mb-4" onClick={() => setModalOpen(true)}>Add Customer</button>
      {customerList.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>Tidak ada Pelanggan yang tersedia.</p>
        </div>
      ) : (
        <motion.ul
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {customerList.map((customer) => (
            <motion.li
              key={customer.id_customer}
              className="bg-base-100 shadow-lg rounded-lg p-6 flex flex-col transition-transform transform hover:scale-105"
            >
              <FaUser  className="text-blue-500 mb-2" size={30} />
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
        onAddCustomer={confirmAddCustomer} // Confirm adding customer
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
        onConfirm={confirmAction} // Confirm delete or update action
        message={`Are you sure you want to ${actionType === 'delete' ? 'delete' : 'add'} this customer?`}
      />
    </div>
  );
};

export default Customer;