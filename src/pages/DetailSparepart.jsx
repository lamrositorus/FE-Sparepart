import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_Source } from '../global/Apisource';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FaBox, FaInfoCircle, FaTag, FaCalendarAlt, FaUser, FaStar } from 'react-icons/fa'; // Importing icons
import { formatPrice } from '../components/Rupiah';

export const DetailSparepart = () => {
  const { id } = useParams(); // Get the spare part ID from the URL
  const [sparepart, setSparepart] = useState(null);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSparepartDetails = async () => {
      setLoading(true);
      try {
        const data = await API_Source.getDetailSparepart(id);
        setSparepart(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await API_Source.getKategori();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const data = await API_Source.getPemasok();
        setSuppliers(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSparepartDetails();
    fetchCategories();
    fetchSuppliers();
  }, [id]); // Dependency array includes id to refetch if it changes

  useEffect(() => {
    // Set loading to false after all fetches are done
    if (sparepart || error) {
      setLoading(false);
    }
  }, [sparepart, error]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>
    );
  }

  // Function to get category name by ID
  const getCategoryName = (id) => {
    const category = categories.find((cat) => cat.id_kategori === id);
    return category ? category.nama_kategori : 'Unknown Category';
  };

  // Function to get supplier name by ID
  const getSupplierName = (id) => {
    const supplier = suppliers.find((sup) => sup.id_pemasok === id);
    return supplier ? supplier.nama_pemasok : 'Unknown Supplier';
  };

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-400">
        {sparepart.nama_sparepart}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-base-100 shadow-lg rounded-lg p-4">
          <img
            src={sparepart.image || 'https://picsum.photos/400/300'} // Use random image if no image is provided
            alt={sparepart.nama_sparepart}
            className="w-full h-auto rounded-lg"
          />
        </div>
        <div className="bg-base-100 shadow-lg rounded-lg p-4">
          <h2 className="text-2xl font-semibold mb-2">
            Price: <span className="text-success">{formatPrice(sparepart.harga)}</span>
          </h2>
          <div className="flex items-center mb-2">
            <FaStar className="text-warning" />
            <span className="ml-2">
              {sparepart.rating} ({sparepart.reviews} reviews)
            </span>
          </div>
          <div className="flex items-center mb-2">
            <FaBox className="text-gray-500 mr-1" />
            <p>Stock: {sparepart.stok}</p>
          </div>
          <div className="flex items-center mb-2">
            <FaInfoCircle className="text-gray-500 mr-1" />
            <p>
              <strong>Description:</strong> {sparepart.deskripsi}
            </p>
          </div>
          <div className="flex items-center mb-2">
            <FaTag className="text-gray-500 mr-1" />
            <p>
              <strong>Category:</strong> {getCategoryName(sparepart.id_kategori)}
            </p>
          </div>
          <div className="flex items-center mb-2">
            <FaUser className="text-gray-500 mr-1" />
            <p>
              <strong>Supplier:</strong> {getSupplierName(sparepart.id_pemasok)}
            </p>
          </div>
          <div className="flex items-center mb-2">
            <FaCalendarAlt className="text-gray-500 mr-1" />
            <p>
              <strong>Entry Date:</strong> {format(new Date(sparepart.tanggal_masuk), 'dd/MM/yyyy')}
            </p>
          </div>
          <div className="flex items-center mb-2">
            <FaCalendarAlt className="text-gray-500 mr-1" />
            <p>
              <strong>Created At:</strong> {format(new Date(sparepart.created_at), 'dd/MM/yyyy')}
            </p>
          </div>
          <div className="flex items-center mb-2">
            <FaCalendarAlt className="text-gray-500 mr-1" />
            <p>
              <strong>Updated At:</strong> {format(new Date(sparepart.updated_at), 'dd/MM/yyyy')}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DetailSparepart;
