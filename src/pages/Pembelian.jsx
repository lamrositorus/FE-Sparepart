import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { Spin, Alert, Button } from 'antd';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
import { formatPrice } from '../components/Rupiah';
import PembelianModal from '../components/ModalPembelian';
import format from 'date-fns/format';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion'; // Import motion and AnimatePresence
import DateFilter from '../components/DateFilter';
import SelectFilter from '../components/SelectFilter';
import SearchFilter from '../components/SearchFilterPembelian'; // Import the SearchFilter component
import ConfirmationModal from '../components/ConfirmationModal';

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
export const Pembelian = () => {
  const [pembelianList, setPembelianList] = useState([]);
  const [pemasokMap, setPemasokMap] = useState({});
  const [sparepartMap, setSparepartMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [pembelianData, setPembelianData] = useState({
    id_sparepart: '',
    id_pemasok: '',
    tanggal: '',
    jumlah: '',
    status: 'Pending',
  });
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDateRange, setFilterDateRange] = useState([null, null]);
  const [searchSparepart, setSearchSparepart] = useState('');
  const [searchPemasok, setSearchPemasok] = useState('');
  const [dateFilter, setDateFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 10;
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [pembelianDataToConfirm, setPembelianDataToConfirm] = useState(null);

  const fetchData = async () => {
    try {
      const [pembelianData, pemasokData, sparepartData] = await Promise.all([
        API_Source.getPembelian(),
        API_Source.getPemasok(),
        API_Source.getSparepart(),
      ]);
      setPembelianList(pembelianData || []);

      const pemasokMapping = {};
      pemasokData.forEach((pemasok) => {
        pemasokMapping[pemasok.id_pemasok] = pemasok.nama_pemasok;
      });
      setPemasokMap(pemasokMapping);

      const sparepartMapping = {};
      sparepartData.forEach((sparepart) => {
        sparepartMapping[sparepart.id_sparepart] = sparepart.nama_sparepart;
      });
      setSparepartMap(sparepartMapping);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddPembelian = async (data) => {
    setPembelianDataToConfirm(data);
    setIsConfirmationModalOpen(true);
  };
  const handleConfirmPembelian = async () => {
    if (!pembelianDataToConfirm) return;

    try {
      // ... (API call)
      await API_Source.postPembelian(
        pembelianDataToConfirm.id_sparepart,
        pembelianDataToConfirm.id_pemasok,
        pembelianDataToConfirm.tanggal,
        pembelianDataToConfirm.jumlah,
        pembelianDataToConfirm.status
      );

      fetchData();
      setPembelianData({
        id_sparepart: '',
        id_pemasok: '',
        tanggal: '',
        jumlah: '',
        status: 'Pending',
      });

      toast.success('Purchase added successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

    } catch (error) {
      toast.error(error.message || "An error occurred.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setIsConfirmationModalOpen(false);
      setPembelianDataToConfirm(null);
    }
  };

  const handleCancelPembelian = () => {
    setIsConfirmationModalOpen(false);
    setPembelianDataToConfirm(null);
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    let newStatus;
    if (currentStatus === 'Pending') {
      newStatus = 'Selesai';
    } else if (currentStatus === 'Selesai') {
      newStatus = 'Dibatalkan';
    } else {
      newStatus = 'Pending';
    }

    // Ganti Swal dengan konfirmasi langsung menggunakan toast
    const confirmUpdate = window.confirm(`Apakah Anda yakin ingin mengubah status menjadi "${newStatus}"?`); // Konfirmasi browser standar

    if (confirmUpdate) {
      try {
        // ... (API call)
        await API_Source.putPembelian(id, newStatus);

        toast.success('Status updated successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        fetchData();
      } catch (error) {
        toast.error(error.message || "An error occurred.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };


  if (loading) {
    return (
<div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    )

  }

  const filteredPembelianList = pembelianList
    .filter((item) => filterStatus === 'All' || item.status === filterStatus)
    .filter((item) => {
      if (!filterDateRange[0] || !filterDateRange[1]) return true;
      const itemDate = new Date(item.tanggal);
      return itemDate >= filterDateRange[0] && itemDate <= filterDateRange[1];
    })
    .filter((item) => {
      const sparepartName = sparepartMap[item.id_sparepart] || '';
      const pemasokName = pemasokMap[item.id_pemasok] || '';
      return (
        sparepartName.toLowerCase().includes(searchSparepart.toLowerCase()) &&
        pemasokName.toLowerCase().includes(searchPemasok.toLowerCase())
      );
    });

  if (dateFilter === 'latest') {
    filteredPembelianList.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  } else if (dateFilter === 'oldest') {
    filteredPembelianList.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
  }

  const sortOptions = [
    { value: '', label: 'Semua' },
    { value: 'latest', label: 'Terbaru' },
    { value: 'oldest', label: 'Terlama' },
  ];

  const statusOptions = [
    { value: 'All', label: 'All' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Selesai', label: 'Selesai' },
    { value: 'Dibatalkan', label: 'Dibatalkan' },
  ];
  //pagination calculation
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = filteredPembelianList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPembelianList.length / itemPerPage);
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="container mx-auto p-4"
    >
      <ToastContainer />
  
      <h1 className="text-4xl font-bold mb-6 text-center">Daftar Pembelian</h1>
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <SelectFilter
          options={statusOptions}
          selectedValue={filterStatus}
          onChange={setFilterStatus}
          placeholder="Filter Status"
          className="select select-bordered"
        />
        <SelectFilter
          options={sortOptions}
          selectedValue={dateFilter}
          onChange={setDateFilter}
          placeholder="Urutkan berdasarkan tanggal"
          className="select select-bordered"
        />
        <DateFilter filterDateRange={filterDateRange} setFilterDateRange={setFilterDateRange} />
        <SearchFilter
          searchPemasok={searchPemasok}
          setSearchPemasok={setSearchPemasok}
          searchSparepart={searchSparepart}
          setSearchSparepart={setSearchSparepart}
        />
        <div className="flex gap-2 justify-stretch w-full">
          <Link to={'/historypembelian'} className="btn btn-info ">
            History pembelian
          </Link>
          <Button
            type="primary"
            onClick={() => setModalOpen(true)}
            className="ml-auto btn btn-primary"
          >
            Add purchase
          </Button>
        </div>
      </div>
  
      {filteredPembelianList.length === 0 ? (
        <Alert
          message="Tidak ada data"
          description="Belum ada data pembelian yang tersedia."
          type="info"
          showIcon
        />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Pemasok</th>
                  <th>Nama Sparepart</th>
                  <th>Jumlah</th>
                  <th>Tanggal</th>
                  <th>Total Harga</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <motion.tr
                    key={item.id_pembelian}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <td className="text-center">{index + 1}</td>
                    <td>{pemasokMap[item.id_pemasok] || 'Unknown Pemasok'}</td>
                    <td>{sparepartMap[item.id_sparepart] || 'Unknown Sparepart'}</td>
                    <td className="text-center">{item.jumlah}</td>
                    <td>{format(new Date(item.tanggal), 'dd/MM/yyyy')}</td>
                    <td>{formatPrice(item.total_harga)}</td>
                    <td className="text-center">
                      <span className="flex items-center justify-center">
                        {item.status === 'Pending' && (
                          <FaHourglassHalf
                            className="text-yellow-500 cursor-pointer"
                            onClick={() => handleUpdateStatus(item.id_pembelian, item.status)}
                          />
                        )}
                        {item.status === 'Selesai' && (
                          <FaCheckCircle
                            className="text-green-500 cursor-pointer"
                            onClick={() => handleUpdateStatus(item.id_pembelian, item.status)}
                          />
                        )}
                        {item.status === 'Dibatalkan' && (
                          <FaTimesCircle
                            className="text-red-500 cursor-pointer"
                            onClick={() => handleUpdateStatus(item.id_pembelian, item.status)}
                          />
                        )}
                        <span className="ml-2">{item.status}</span>
                      </span>
                    </td>
                    <td className="text-center">
                      <Link to={`${item.id_pembelian}`} className="btn btn-link">
                        Detail
                      </Link>
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
      )}
  
      <PembelianModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddPembelian={handleAddPembelian}
        pembelianData={pembelianData}
        setPembelianData={setPembelianData}
        sparepartMap={sparepartMap}
        pemasokMap={pemasokMap}
      />
  
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={handleCancelPembelian}
        onConfirm={handleConfirmPembelian}
        message="Are you sure you want to add this purchase?"
      />
    </motion.div>
  );
};

export default Pembelian;
