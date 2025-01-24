import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { motion } from 'framer-motion';
import { FaUser , FaMapMarkedAlt, FaPhone, FaEnvelope, FaTrash, FaEdit } from 'react-icons/fa';
import CustomerModal from '../components/ModalCustomer'; // Import the modal component
import EditCustomerModal from '../components/EditCustomerModal'; // Import the edit modal component
import Swal from 'sweetalert2'; // Import SweetAlert2

export const Customer = () => {
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false); // State for edit modal
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

  // Function to add a new customer
  const handleAddCustomer = async (data) => {
    try {
      const newCustomer = await API_Source.postCustomer(
        data.nama_customer,
        data.alamat,
        data.telepon,
        data.email
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
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Customer added successfully!',
      });
    } catch (error) {
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to add customer. Please try again later.',
      });
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
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Customer updated successfully!',
      });
    } catch (error) {
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to update customer. Please try again later.',
      });
    }
  };

  // Function to delete a customer
  const handleDeleteCustomer = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this customer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await API_Source.deleteCustomer(id);
        console.log('Customer deleted:', id);
        fetchCustomers(); // Refresh the list after deletion
        Swal.fire('Deleted!', 'The customer has been deleted.', 'success');
      } catch (error) {
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to delete customer. Please try again later.',
        });
      }
    }
  };

  // Function to open the edit modal
  const openEditModal = (customer) => {
    setCustomerData(customer);
    setEditModalOpen(true);
  };

  // Display loading or error if any
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">Daftar Pelanggan</h1>
      {customerList.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>Tidak ada Pelanggan yang tersedia.</p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
          >
            Add Customer
          </button>
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
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col transition-transform transform"
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

      <div className="mt-6">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
        >
          Add Customer
        </button>
      </div>

      <CustomerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddCustomer={handleAddCustomer}
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
    </div>
  );
};