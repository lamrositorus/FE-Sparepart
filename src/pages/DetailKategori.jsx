import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTag, FaTrash, FaInfoCircle, FaCalendarAlt } from 'react-icons/fa'; // Importing icons
import format from 'date-fns/format';
import Breadcrumb from '../components/BreadCumb'; // Import the Breadcrumb component
import { useAuth } from '../context/AuthContext'; // Adjust the path accordingly
import { useNavigate } from 'react-router-dom';
export const DetailKategori = () => {
  const { id } = useParams();
  const { id: userId } = useAuth(); // Get user ID from AuthContext
  const [kategoriDetail, setKategoriDetail] = useState(null);
  const [relatedCategories, setRelatedCategories] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchKategoriDetail = async () => {
      try {
        const data = await API_Source.getDetailKategori(id);
        setKategoriDetail(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchRelatedCategories = async () => {
      try {
        const data = await API_Source.getKategori();
        // Filter out the current category from the related categories
        const filteredCategories = data.filter((category) => category.id_kategori !== id);
        setRelatedCategories(filteredCategories);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchKategoriDetail();
    fetchRelatedCategories();
  }, [id]);

  const handleDelete = async () => {
    try {
      await API_Source.deleteKategori(id);
      // Redirect to the categories page after successful deletion
      navigate('/kategori');
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>
    );
  }

  if (!kategoriDetail) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Define the breadcrumb links
  const breadcrumbLinks = [
    { path: '/kategori', label: 'Categories' },
    { path: '#', label: 'Detail Kategori' },
  ];

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Breadcrumb
        links={breadcrumbLinks} // Pass the links to the Breadcrumb
        userId={userId} // Pass the user ID to the Breadcrumb
      />
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">Detail Kategori</h1>
      <div className="bg-white shadow-lg rounded-lg p-4">
        <div className="flex items-center mb-2">
          <FaTag className="text-gray-500 mr-2" />
          <p>
            <strong>ID Kategori:</strong> {kategoriDetail.id_kategori}
          </p>
        </div>
        <div className="flex items-center mb-2">
          <FaTag className="text-gray-500 mr-2" />
          <p>
            <strong>Nama Kategori:</strong> {kategoriDetail.nama_kategori}
          </p>
        </div>
        <div className="flex items-center mb-2">
          <FaInfoCircle className="text-gray-500 mr-2" />
          <p>
            <strong>Deskripsi:</strong> {kategoriDetail.deskripsi}
          </p>
        </div>
        <div className="flex items-center mb-2">
          <FaCalendarAlt className="text-gray-500 mr-2" />
          <p>
            <strong>Created At:</strong> {format(new Date(kategoriDetail.created_at), 'dd/MM/yyyy')}
          </p>
        </div>
        <div className="flex items-center mb-2">
          <FaCalendarAlt className="text-gray-500 mr-2" />
          <p>
            <strong>Updated At:</strong> {format(new Date(kategoriDetail.updated_at), 'dd/MM/yyyy')}
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200 flex items-center"
        >
          <FaTrash className="mr-2" /> Delete Category
        </button>
      </div>

      {/* Related Categories Section */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold">Related Categories</h2>
        <ul className="list-disc pl-5">
          {relatedCategories.map((category) => (
            <li key={category.id_kategori}>
              <Link to={`/kategori/${category.id_kategori}`} className="text-blue-600">
                {category.nama_kategori}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};
