import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { motion } from 'framer-motion';
import { FaWrench, FaMoneyBillWave, FaBox } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { formatPrice } from '../components/Rupiah';
import Modal from '../components/ModalSparepart'; // Import the Modal component
import EditSparepartModal from '../components/EditSparepartModal'; // Import the edit modal component
import format from 'date-fns/format';

export const Sparepart = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [sparepartData, setSparepartData] = useState({
    namaSparepart: '',
    harga: '',
    margin: '',
    stok: '',
    deskripsi: '',
    selectedKategori: '',
    selectedPemasok: '',
  });
  const [editSparepartData, setEditSparepartData] = useState(null);
  const [sparepartList, setSparepartList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]); // Initialize kategoriList
  const [pemasokList, setPemasokList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch spare parts, categories, and suppliers using useEffect
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const spareparts = await API_Source.getSparepart();
        const categories = await API_Source.getKategori(); // Fetch categories
        const suppliers = await API_Source.getPemasok();

        setSparepartList(spareparts);
        setKategoriList(categories); // Set kategoriList
        setPemasokList(suppliers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddSparepart = async (data) => {
    const tanggal_masuk = new Date().toISOString();
    try {
      const newSparepart = await API_Source.postSparepart(
        data.namaSparepart,
        data.harga,
        data.margin,
        data.stok,
        data.selectedKategori,
        data.selectedPemasok,
        data.deskripsi,
        tanggal_masuk
      );
      console.log('New Sparepart added:', newSparepart);
      setSparepartData({
        namaSparepart: '',
        harga: '',
        margin: '',
        stok: '',
        deskripsi: '',
        selectedKategori: '',
        selectedPemasok: '',
      });
      // Optionally, you can refetch the spare parts after adding a new one
      const updatedSpareparts = await API_Source.getSparepart();
      setSparepartList(updatedSpareparts);
    } catch (error) {
      console.error('Error adding sparepart:', error);
      setError('Failed to add spare part. Please check your input.'); // Set error message
    }
  };

  const handleUpdateSparepart = async (data) => {
    try {
      await API_Source.updatedSparepart(
        data.id,
        data.nama_sparepart,
        data.harga,
        data.margin,
        data.stok,
        data.id_kategori,
        data.id_pemasok,
        data.deskripsi,
        data.tanggal_masuk
      );
      alert('Sparepart updated successfully!');
      setEditModalOpen(false);
      // Refetch the spare parts after updating
      const updatedSpareparts = await API_Source.getSparepart();
      setSparepartList(updatedSpareparts);
    } catch (error) {
      console.error('Error updating sparepart:', error);
      setError('Failed to update spare part. Please check your input.'); // Set error message
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  
  
return (
  <div className="container mx-auto p-4">
    <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">Daftar Sparepart</h1>
    {loading ? (
      <div className="flex justify-center items-center h-screen">Loading...</div>
    ) : sparepartList && sparepartList.length > 0 ? (
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {sparepartList.map((sparepart) => {
          const marginPercentage =
            sparepart.harga_jual && sparepart.harga
              ? ((sparepart.harga_jual - sparepart.harga) / sparepart.harga_jual) * 100
              : 0;

          return (
            <motion.div
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col transition-transform transform"
              key={sparepart.id_sparepart}
            >
              <div className="flex items-center mb-2">
                <FaWrench className="text-blue-500 mr-2" size={24} />
                <Link to={`${sparepart.id_sparepart}`} className="text-xl font-semibold">
                  {sparepart.nama_sparepart}
                </Link>
              </div>
              <p className="text-gray-600">{sparepart.deskripsi}</p>
              <div className="flex items-center mt-2">
                <FaMoneyBillWave className="text-gray-500 mr-1" />
                <p className="text-lg font-bold text-green-600">
                  Harga: {formatPrice(sparepart.harga)}
                </p>
              </div>
              <div className="flex items-center mt-2">
                <FaMoneyBillWave className="text-gray-500 mr-1" />
                <p className="text-lg font-bold text-green-600">
                  Harga Jual: {formatPrice(sparepart.harga_jual)}
                </p>
              </div>
              <div className="flex items-center mt-2">
                <FaMoneyBillWave className="text-gray-500 mr-1" />
                <p className="text-lg font-bold text-red-600">
                  Margin: {marginPercentage.toFixed()}%
                </p>
              </div>
              <div className="flex items-center mt-2">
                <FaBox className="text-gray-500 mr-1" />
                <p>Stok: {sparepart.stok}</p>
              </div>
              <p className="text-sm text-gray-500">
                Tanggal Masuk: {format(new Date(sparepart.tanggal_masuk), 'dd/MM/yyyy')}
              </p>
              <div className="flex justify-between mt-4">
                <Link
                  to={`/sparepart/${sparepart.id_sparepart}`}
                  className="flex justify-center text-blue-500 hover:underline text-sm"
                >
                  Detail
                </Link>
                <button
                  onClick={() => {
                    setEditSparepartData(sparepart);
                    setEditModalOpen(true);
                  }}
                  className="text-red-500 hover:underline text-sm"
                >
                  Edit
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    ) : (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Tidak ada data</h1>
          <p className="text-gray-600">Silakan tambahkan data sparepart.</p>
          <div className="mt-6">
            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
            >
              Add Sparepart
            </button>
          </div>
        </div>
      </div>
    )}
    {error && <div className="text-red-500 text-center mt-4">{error}</div>}
    <div className="mt-6">
      <button
        onClick={() => setModalOpen(true)}
        className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
      >
        Add Sparepart
      </button>
    </div>

    <Modal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      onAddSparepart={handleAddSparepart}
      sparepartData={{ ...sparepartData, kategoriList, pemasokList }}
      setSparepartData={setSparepartData}
    />
    <EditSparepartModal
      isOpen={editModalOpen}
      onClose={() => setEditModalOpen(false)}
      onUpdateSparepart={handleUpdateSparepart}
      sparepartData={editSparepartData}
      kategoriList={kategoriList} // Pass kategoriList to the modal
      pemasokList={pemasokList} // Pass pemasokList to the modal
    />
  </div>
);
};

export default Sparepart;
