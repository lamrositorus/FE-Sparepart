import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import PenjualanModal from '../components/ModalPenjual';
import format from 'date-fns/format';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DateFilter from '../components/DateFilter';
import SelectFilter from '../components/SelectFilter';
import SearchFilter from '../components/SearchFilterPenjualan';
import { Link } from 'react-router-dom';
import { formatPrice } from '../components/Rupiah';
import { Button, Alert } from 'antd';
import ConfirmationModal from '../components/ConfirmationModal';
import { motion } from 'framer-motion'; // Import motion and AnimatePresence


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
export const Penjualan = () => {
  const [penjualanList, setPenjualanList] = useState([]);
  const [customerMap, setCustomerMap] = useState({});
  const [sparepartMap, setSparepartMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState('');
  const [penjualanData, setPenjualanData] = useState({
    id_sparepart: '',
    id_customer: '',
    tanggal: '',
    jumlah: '',
    metode_pembayaran: 'Tunai',
  });
  const [searchCustomer, setSearchCustomer] = useState('');
  const [searchSparepart, setSearchSparepart] = useState('');
  const [filterDateRange, setFilterDateRange] = useState([null, null]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 10;
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [penjualanDataToConfirm, setPenjualanDataToConfirm] = useState(null);

  const fetchData = async () => {
    try {
      const [penjualanData, customerData, sparepartData] = await Promise.all([
        API_Source.getPenjualan(),
        API_Source.getCustomer(),
        API_Source.getSparepart(),
      ]);
      setPenjualanList(penjualanData || []);

      const customerMapping = {};
      customerData.forEach((customer) => {
        customerMapping[customer.id_customer] = customer.nama_customer;
      });
      setCustomerMap(customerMapping);

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

  const handleAddPenjualan = (data) => {
    setPenjualanDataToConfirm(data);
    setIsConfirmationModalOpen(true);
  };
  const handleConfirmPenjualan = async () => {
    if (!penjualanDataToConfirm) return;

    try {
      await API_Source.postPenjualan(
        penjualanDataToConfirm.id_sparepart,
        penjualanDataToConfirm.id_customer,
        penjualanDataToConfirm.tanggal,
        penjualanDataToConfirm.jumlah,
        penjualanDataToConfirm.metode_pembayaran
      );

      fetchData();
      setPenjualanData({
        id_sparepart: '',
        id_customer: '',
        tanggal: '',
        jumlah: '',
        metode_pembayaran: 'Tunai',
      });

      toast.success('Sale added successfully!', {
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
      setPenjualanDataToConfirm(null);
    }
  };

  const handleCancelPenjualan = () => {
    setIsConfirmationModalOpen(false);
    setPenjualanDataToConfirm(null);
  };


  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
    <span className="loading loading-infinity loading-lg"></span>
  </div>
  }

  // Filter and sort the penjualanList based on search term and date range
  const filteredPenjualanList = penjualanList
    .filter((item) => {
      const customerName = customerMap[item.id_customer] || '';
      const sparepartName = sparepartMap[item.id_sparepart] || '';
      return (
        customerName.toLowerCase().includes(searchCustomer.toLowerCase()) &&
        sparepartName.toLowerCase().includes(searchSparepart.toLowerCase())
      );
    })
    .filter((item) => {
      if (!filterDateRange[0] || !filterDateRange[1]) return true; // If no date filter, show all
      const itemDate = new Date(item.tanggal);
      return itemDate >= filterDateRange[0] && itemDate <= filterDateRange[1];
    });

  // Sort the filtered list based on the selected date filter
  const sortedPenjualanList = filteredPenjualanList.sort((a, b) => {
    if (dateFilter === 'latest') {
      return new Date(b.tanggal) - new Date(a.tanggal); // Sort by date descending
    } else if (dateFilter === 'oldest') {
      return new Date(a.tanggal) - new Date(b.tanggal); // Sort by date ascending
    }
    return 0; // No sorting
  });

  const sortOptions = [
    { value: '', label: 'Semua' },
    { value: 'latest', label: 'Terbaru' },
    { value: 'oldest', label: 'Terlama' },
  ];

  //pagination calculate
  const indexLastItem = currentPage * itemPerPage;
  const indexFirstItem = indexLastItem - itemPerPage;
  const currentItems = sortedPenjualanList.slice(indexFirstItem, indexLastItem);
  const totalPages = Math.ceil(sortedPenjualanList.length / itemPerPage);
  return (
    <motion.div
      className="p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <ToastContainer />
      <h1 className="text-4xl font-bold mb-6 text-center">Daftar Penjualan</h1>
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <SearchFilter
          searchCustomer={searchCustomer}
          setSearchCustomer={setSearchCustomer}
          searchSparepart={searchSparepart}
          setSearchSparepart={setSearchSparepart}
        />
        <SelectFilter
          options={sortOptions}
          selectedValue={dateFilter}
          onChange={setDateFilter}
          placeholder="Urutkan berdasarkan tanggal"
        />
        <DateFilter filterDateRange={filterDateRange} setFilterDateRange={setFilterDateRange} />
        <div className="flex gap-2 justify-stretch w-full">
          <Link to={'/historypenjualan'} className="btn btn-info text-white">
            History Penjualan
          </Link>
          

          <Button
            type="primary"
            onClick={() => setModalOpen(true)}
            className="ml-auto btn btn-primary"
          >
            Add Sale
          </Button>
        </div>
      </div>
      {sortedPenjualanList.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Customer</th>
                  <th>Nama Sparepart</th>
                  <th>Jumlah</th>
                  <th>Tanggal</th>
                  <th>Total Harga</th>
                  <th>Metode Pembayaran</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <motion.tr key={item.id_penjualan} variants={itemVariants}>
                    <td>{index + 1}</td>
                    <td>{customerMap[item.id_customer] || 'Unknown Customer'}</td>
                    <td>{sparepartMap[item.id_sparepart] || 'Unknown Sparepart'}</td>
                    <td className="text-center">{item.jumlah}</td>
                    <td>{format(new Date(item.tanggal), 'dd/MM/yyyy')}</td>
                    <td>{formatPrice(item.total_harga)}</td>
                    <td className="text-center">{item.metode_pembayaran}</td>
                    <td>
                      <Link to={`/penjualan/${item.id_penjualan}`} className="btn btn-link">
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
      ) : (
        <Alert
          message="Tidak ada penjualan"
          description="Belum ada data penjualan yang tersedia."
          type="info"
          showIcon
        />
      )}
      <PenjualanModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddPenjualan={handleAddPenjualan}
        penjualanData={penjualanData}
        setPenjualanData={setPenjualanData}
        sparepartMap={sparepartMap}
        customerMap={customerMap}
      />
  
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={handleCancelPenjualan}
        onConfirm={handleConfirmPenjualan}
        message="Are you sure you want to add this sale?"
      />
    </motion.div>
  );
};

export default Penjualan;
