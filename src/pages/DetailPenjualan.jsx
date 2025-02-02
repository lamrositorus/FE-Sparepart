import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { API_Source } from '../global/Apisource';
import { FaTag, FaUser , FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa'; // Importing icons
import Breadcrumb from '../components/BreadCumb'; // Import the Breadcrumb component
import { formatPrice } from '../components/Rupiah';
import StatusIcon from '../components/StatusIcon'; // Import the StatusIcon component

export const DetailPenjualan = () => {
  const { id } = useParams(); // Get the sale ID from the URL
  const [penjualan, setPenjualan] = useState(null);
  const [spareparts, setSpareparts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetailPenjualan = async () => {
      setLoading(true);
      try {
        const data = await API_Source.getDetailPenjualan(id);
        setPenjualan(data);
      } catch (err) {
        const error = err.response ? err.response.data : err.message;
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSpareParts = async () => {
      try {
        const data = await API_Source.getSparepart(); // Fetch spare parts
        setSpareparts(data);
      } catch (err) {
        const error = err.response ? err.response.data : err.message;
        setError(error);
      }
    };

    const fetchCustomers = async () => {
      try {
        const data = await API_Source.getCustomer(); // Fetch customers
        setCustomers(data);
      } catch (err) {
        const error = err.response ? err.response.data : err.message;
        setError(error);
      }
    };

    fetchDetailPenjualan();
    fetchSpareParts();
    fetchCustomers();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-blue-600">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>
    );
  }

  if (!penjualan || penjualan.length === 0) {
    return <div className="flex justify-center items-center h-screen">No Data Available</div>;
  }

  const detail = penjualan[0];

  // Function to get spare part name by ID
  const getSparePartName = (id) => {
    const sparePart = spareparts.find((part) => part.id_sparepart === id);
    return sparePart ? sparePart.nama_sparepart : 'Unknown Spare Part';
  };

  // Function to get customer name by ID
  const getCustomerName = (id) => {
    const customer = customers.find((cust) => cust.id_customer === id);
    return customer ? customer.nama_customer : 'Unknown Customer';
  };

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Breadcrumb
        links={[
          { path: '/kategori', label: 'Home' },
          { path: '/penjualan', label: 'Penjualan' },
        ]}
      />
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">Detail Penjualan</h1>
      <div className="bg-base-100 shadow-lg rounded-lg p-6">
        <div className="flex flex-col gap-5 md:flex-row">
          <div className="md:w-1/3 mb-4 md:mb-0">
            <img
              src={detail.image || `https://picsum.photos/400/300`} // Use random image if no image is provided
              alt={getSparePartName(detail.id_sparepart)}
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="md:w-1/2">
            <ul className="space-y-4">
              <li className="flex items-center">
                <FaTag className="mr-2 text-blue-500" />
                <strong>Spare Part:</strong>
                <span className="ml-4">{getSparePartName(detail.id_sparepart)}</span>
              </li>
              <li className="flex items-center">
                <FaUser  className="mr-2 text-blue-500" />
                <strong>Customer:</strong>
                <span className="ml-4">{getCustomerName(detail.id_customer)}</span>
              </li>
              <li className="flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                <strong>Tanggal:</strong>
                <span className="ml-4">{format(new Date(detail.tanggal), 'dd/MM/yyyy')}</span>
              </li>
              <li className="flex items-center">
                <FaMoneyBillWave className="mr-2 text-blue-500" />
                <strong>Jumlah:</strong>
                <span className="ml-4">{detail.jumlah}</span>
              </li>
              <li className="flex items-center">
                <FaMoneyBillWave className="mr-2 text-blue-500" />
                <strong>Total Harga:</strong>
                <span className="ml-4">{formatPrice(detail.total_harga)}</span>
              </li>
              <li className="flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                <strong>Created At:</strong>
                <span className="ml-4">{format(new Date(detail.created_at), 'dd/MM/yyyy')}</span>
              </li>
              <li className="flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                <strong>Updated At:</strong>
                <span className="ml-4">{format(new Date(detail.updated_at), 'dd/MM/yyyy')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DetailPenjualan;