import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { FaExclamationTriangle } from 'react-icons/fa';
import { formatPrice } from '../components/Rupiah';
import DateFilter from '../components/DateFilter';
import SearchFilter from '../components/SearchFilterPembelian';
import SelectFilter from '../components/SelectFilter';
import { motion } from 'framer-motion';

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
const sortOptions = [
  { value: '', label: 'Semua' },
  { value: 'latest', label: 'Terbaru' },
  { value: 'oldest', label: 'Terlama' },
];
export const HistoryPembelian = () => {
  const [historyData, setHistoryData] = useState([]);
  const [pemasok, setPemasok] = useState([]);
  const [spareparts, setSpareparts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchPemasok, setSearchPemasok] = useState('');
  const [searchSparepart, setSearchSparepart] = useState('');
  const [filterDateRange, setFilterDateRange] = useState([null, null]);
  const [dateFilter, setDateFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemPerpages = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [history, pemasokData, sparepartsData] = await Promise.all([
          API_Source.getHistoryPembelian(),
          API_Source.getPemasok(),
          API_Source.getSparepart(),
        ]);
        setHistoryData(history);
        setPemasok(pemasokData);
        setSpareparts(sparepartsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExport = async () => {
    try {
      const blob = await API_Source.exportHistoryPembelian();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'history_pembelian.csv'; // Nama file yang akan diunduh
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Error exporting data:', error);
      setError('Gagal mengekspor data');
    }
  };

  if (loading) {
    return <span className="loading loading-spinner text-accent"></span>;
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg">
        <FaExclamationTriangle className="text-xl" />
        <span>{error}</span>
      </div>
    );
  }

  const pemasokMap = Object.fromEntries(
    pemasok.map((item) => [item.id_pemasok, item.nama_pemasok])
  );
  const sparepartMap = Object.fromEntries(
    spareparts.map((item) => [item.id_sparepart, item.nama_sparepart])
  );

  const filteredData = historyData
    .filter((item) => {
      const pemasokName = pemasokMap[item.id_pemasok] || '';
      const sparepartName = sparepartMap[item.id_sparepart] || '';
      return (
        pemasokName.toLowerCase().includes(searchPemasok.toLowerCase()) &&
        sparepartName.toLowerCase().includes(searchSparepart.toLowerCase())
      );
    })
    .filter((item) => {
      if (!filterDateRange[0] || !filterDateRange[1]) return true;
      const itemDate = new Date(item.tanggal);
      return itemDate >= filterDateRange[0] && itemDate <= filterDateRange[1];
    });

  if (dateFilter === 'latest') {
    filteredData.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  } else if (dateFilter === 'oldest') {
    filteredData.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
  }

  const indexLastItem = currentPage * itemPerpages;
  const indexFirstItem = indexLastItem - itemPerpages;
  const currentItems = filteredData.slice(indexFirstItem, indexLastItem);
  const totalPages = Math.ceil(filteredData.length / itemPerpages);

  return (
    <motion.div
      className="p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h1 className="text-4xl font-bold mb-6 text-center">History Pembelian</h1>
      <div className="flex justify-between mb-4">
        <SearchFilter
          searchPemasok={searchPemasok}
          setSearchPemasok={setSearchPemasok}
          searchSparepart={searchSparepart}
          setSearchSparepart={setSearchSparepart}
        />
        <button className="btn btn-primary" onClick={handleExport}>
          Ekspor Data
        </button>
      </div>
      <DateFilter filterDateRange={filterDateRange} setFilterDateRange={setFilterDateRange} />
      <SelectFilter options={sortOptions} selectedValue={dateFilter} onChange={setDateFilter} />
      {filteredData.length === 0 ? (
        <div className="alert alert-info mt-4">
          <span>Belum ada data history pembelian yang tersedia.</span>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto mt-4">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>ID History Pembelian</th>
                  <th>ID Pembelian</th>
                  <th>Nama Pemasok</th>
                  <th>Nama Sparepart</th>
                  <th>Jumlah</th>
                  <th>Total Harga</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <motion.tr
                    key={item.id_history_pembelian}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <td>{item.id_history_pembelian}</td>
                    <td>{item.id_pembelian}</td>
                    <td>{pemasokMap[item.id_pemasok] || 'Unknown Pemasok'}</td>
                    <td>{sparepartMap[item.id_sparepart] || 'Unknown Sparepart'}</td>
                    <td>{item.jumlah}</td>
                    <td>{formatPrice(item.total_harga)}</td>
                    <td>{new Date(item.tanggal).toLocaleDateString()}</td>
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
    </motion.div>
  );
};

export default HistoryPembelian;