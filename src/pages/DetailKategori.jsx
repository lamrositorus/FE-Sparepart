import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTag, FaTrash, FaInfoCircle, FaCalendarAlt } from 'react-icons/fa';
import format from 'date-fns/format';
import Breadcrumb from '../components/BreadCumb';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const DetailKategori = () => {
  const { id } = useParams();
  const { id: userId } = useAuth();
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
      const confirmResult = await Swal.fire({
        title: 'Apakah Anda yakin?',
        text: 'Data kategori akan dihapus secara permanen.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Hapus!',
      });

      if (confirmResult.isConfirmed) {
        await API_Source.deleteKategori(id);
        Swal.fire('Berhasil!', 'Kategori berhasil dihapus.', 'success');
        navigate('/kategori');
      }
    } catch (err) {
      setError(err.message);
      Swal.fire('Error!', err.message || 'Gagal menghapus kategori.', 'error');
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-error mt-2">
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!kategoriDetail) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const breadcrumbLinks = [
    { path: '/kategori', label: 'Categories' },
    { path: `/kategori/${id}`, label: kategoriDetail.nama_kategori },
  ];

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Breadcrumb links={breadcrumbLinks} />
      <h1 className="text-4xl font-bold text-center mb-6 ">Detail Kategori</h1>
      <motion.div
        className="card bg-base-100 shadow-xl p-6 hover:shadow-2xl"
        transition={{ type: 'spring', stiffness: 300 }}
      >
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
        <button onClick={handleDelete} className="btn btn-error mt-4 flex items-center">
          <FaTrash className="mr-2" /> Delete Category
        </button>
      </motion.div>

      {/* Related Categories Section */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Related Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedCategories.map((category) => (
            <motion.div
              key={category.id_kategori}
              className="card bg-base-100 shadow-xl p-4 hover:shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Link to={`/kategori/${category.id_kategori}`}>
                <div className="flex items-center">
                  <FaTag className="text-gray-500 mr-2" />
                  <p className="text-lg font-semibold">{category.nama_kategori}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default DetailKategori;
