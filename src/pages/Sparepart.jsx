import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { formatPrice } from '../components/Rupiah';
import Modal from '../components/ModalSparepart';
import EditSparepartModal from '../components/EditSparepartModal';
import format from 'date-fns/format';
import DateFilter from '../components/DateFilter';
import SearchFilter from '../components/SearchFilterSparepart';
import SelectFilter from '../components/SelectFilter';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmationModal from '../components/ConfirmationModal';
import { Alert } from 'antd';
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.5 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.5 } }
};
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
  const [kategoriList, setKategoriList] = useState([]);
  const [pemasokList, setPemasokList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDateRange, setFilterDateRange] = useState([null, null]);
  const [dateFilter, setDateFilter] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const spareparts = await API_Source.getSparepart();
        const categories = await API_Source.getKategori();
        const suppliers = await API_Source.getPemasok();

        spareparts.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        setSparepartList(spareparts);
        setKategoriList(categories);
        setPemasokList(suppliers);
      } catch (err) {
        toast.error(err || 'Gagal mengambil data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddSparepart = () => {
    setActionType('add');
    setConfirmModalOpen(true);
  };

  const handleUpdateSparepart = (updatedData) => {
    setEditSparepartData(updatedData);
    setActionType('update');
    setConfirmModalOpen(true);
  };

  const confirmAddSparepart = async () => {
    try {
      const dataToSend = {
        nama_sparepart: sparepartData.namaSparepart,
        harga: Number(sparepartData.harga),
        margin: Number(sparepartData.margin),
        stok: Number(sparepartData.stok),
        id_kategori: sparepartData.selectedKategori,
        id_pemasok: sparepartData.selectedPemasok,
        deskripsi: sparepartData.deskripsi,
        tanggal_masuk: new Date().toISOString(),
      };

      await API_Source.postSparepart(
        dataToSend.nama_sparepart,
        dataToSend.harga,
        dataToSend.margin,
        dataToSend.stok,
        dataToSend.id_kategori,
        dataToSend.id_pemasok,
        dataToSend.deskripsi,
        dataToSend.tanggal_masuk
      );

      setSparepartData({
        namaSparepart: '',
        harga: '',
        margin: '',
        stok: '',
        deskripsi: '',
        selectedKategori: '',
        selectedPemasok: '',
      });

      const freshData = await API_Source.getSparepart();
      freshData.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      setSparepartList(freshData);

      setModalOpen(false);
      setConfirmModalOpen(false);

      toast.success('Sparepart berhasil ditambahkan!');
    } catch (error) {
      console.error('Add error:', error);
      toast.error(error.message || 'Gagal menambahkan sparepart');
    }
  };

  const confirmUpdateSparepart = async () => {
    try {
      if (!editSparepartData) {
        toast.error('Tidak ada data yang akan diupdate');
        return;
      }

      const updated_at = new Date().toISOString();

      await API_Source.updatedSparepart(
        editSparepartData.id_sparepart,
        editSparepartData.nama_sparepart,
        editSparepartData.harga,
        editSparepartData.margin,
        editSparepartData.stok,
        editSparepartData.id_kategori,
        editSparepartData.id_pemasok,
        editSparepartData.deskripsi,
        updated_at
      );

      const updatedSpareparts = await API_Source.getSparepart();
      updatedSpareparts.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

      setSparepartList(updatedSpareparts);
      toast.success('Sparepart berhasil diupdate!');

      setEditModalOpen(false);
      setConfirmModalOpen(false);
    } catch (error) {
      toast.error(error?.message || 'Gagal mengupdate sparepart');
    }
  };

  const filteredSpareparts = sparepartList.filter((sparepart) => {
    const isWithinDateRange = () => {
      if (!filterDateRange[0] || !filterDateRange[1]) return true;
      const itemDate = new Date(sparepart.updated_at);
      return itemDate >= filterDateRange[0] && itemDate <= filterDateRange[1];
    };

    return (
      sparepart.nama_sparepart.toLowerCase().includes(searchTerm.toLowerCase()) &&
      isWithinDateRange()
    );
  });

  if (dateFilter === 'latest') {
    filteredSpareparts.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  } else if (dateFilter === 'oldest') {
    filteredSpareparts.sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at));
  }

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSpareparts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSpareparts.length / itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-5">Daftar Sparepart</h1>
  
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center">
        <div className="flex-1 w-full md:w-auto">
          <SearchFilter searchSparepart={searchTerm} setSearchSparepart={setSearchTerm} />
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-auto">
          <DateFilter filterDateRange={filterDateRange} setFilterDateRange={setFilterDateRange} />
  
          <SelectFilter
            options={[
              { value: '', label: 'Semua' },
              { value: 'latest', label: 'Terbaru' },
              { value: 'oldest', label: 'Terlama' },
            ]}
            selectedValue={dateFilter}
            onChange={setDateFilter}
            placeholder="Urutkan tanggal"
          />
        </div>
  
        <button onClick={() => setModalOpen(true)} className="btn btn-primary md:ml-auto">
          Tambah Sparepart
        </button>
      </div>
  
      <AnimatePresence>
        {currentItems.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Sparepart</th>
                    <th>Deskripsi</th>
                    <th>Harga</th>
                    <th>Margin (%)</th>
                    <th>Harga jual</th>
                    <th>Stok</th>
                    <th>Tanggal Masuk</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((sparepart, index) => (
                    <motion.tr
                      key={sparepart.id_sparepart}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>{sparepart.nama_sparepart}</td>
                      <td>{sparepart.deskripsi}</td>
                      <td>{formatPrice(sparepart.harga)}</td>
                      <td>{(sparepart.margin * 100).toFixed(0)}%</td>                      <td>{formatPrice(sparepart.harga_jual)}</td>
                      <td>{sparepart.stok}</td>
                      <td>{format(new Date(sparepart.tanggal_masuk), 'dd/MM/yyyy')}</td>
                      <td>
                        <button
                          onClick={() => {
                            setEditSparepartData(sparepart);
                            setEditModalOpen(true);
                          }}
                          className="btn btn-sm btn-primary"
                        >
                          <FaEdit />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
  
            <div className="flex justify-center mt-4">
              <div className="join">
                <button
                  className="join-item btn"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                <button
                  className="join-item btn"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`join-item btn ${currentPage === i + 1 ? 'btn-active' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="join-item btn"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  ›
                </button>
                <button
                  className="join-item btn"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
            </div>
          </>
        ) : (
          <Alert
            message="Tidak ada data"
            description="Belum ada data pembelian yang tersedia."
            type="info"
            showIcon
          />
        )}
      </AnimatePresence>
  
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
        kategoriList={kategoriList}
        pemasokList={pemasokList}
      />
  
      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={actionType === 'add' ? confirmAddSparepart : confirmUpdateSparepart}
        message={
          actionType === 'add'
            ? 'Apakah Anda yakin ingin menambahkan sparepart ini?'
            : 'Apakah Anda yakin ingin memperbarui sparepart ini?'
        }
      />
  
      <ToastContainer />
    </motion.div>
  );
};

export default Sparepart;
