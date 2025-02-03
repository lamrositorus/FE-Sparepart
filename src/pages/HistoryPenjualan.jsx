import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { FaExclamationTriangle } from 'react-icons/fa';
import { formatPrice } from '../components/Rupiah';
import DateFilter from '../components/DateFilter'; // Import the DateFilter component
import SearchFilter from '../components/SearchFilterPenjualan'; // Import the SearchFilter component
import { Alert } from 'antd'; // Import components from Ant Design
import SelectFilter from '../components/SelectFilter';

export const HistoryPenjualan = () => {
  const [historyData, setHistoryData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [spareparts, setSpareparts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCustomer, setSearchCustomer] = useState('');
  const [searchSparepart, setSearchSparepart] = useState('');
  const [filterDateRange, setFilterDateRange] = useState([null, null]); // State for date filter
  const [dateFilter, setDateFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemPerpages = 10;
  const fetchHistoryPenjualan = async () => {
    try {
      const data = await API_Source.getHistoryPenjualan();
      setHistoryData(data);
    } catch (error) {
      console.error('Error fetching history penjualan:', error);
      setError(error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const data = await API_Source.getCustomer();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError(error);
    }
  };

  const fetchSpareparts = async () => {
    try {
      const data = await API_Source.getSparepart();
      setSpareparts(data);
    } catch (error) {
      console.error('Error fetching spareparts:', error);
      setError(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchHistoryPenjualan(), fetchCustomers(), fetchSpareparts()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={
          <span>
            <FaExclamationTriangle /> {error}
          </span>
        }
        type="error"
        showIcon
      />
    );
  }
  //calculate pages
  const indexLastItem = currentPage * itemPerpages;
  const indexFirstItem = indexLastItem - itemPerpages;
  const currentItems = historyData.slice(indexFirstItem, indexLastItem);
  const totalPages = Math.ceil(historyData.length / itemPerpages);

  const customerMap = {};
  customers.forEach((customer) => {
    customerMap[customer.id_customer] = customer.nama_customer;
  });

  const sparepartMap = {};
  spareparts.forEach((sparepart) => {
    sparepartMap[sparepart.id_sparepart] = sparepart.nama_sparepart;
  });

  // Filter data based on search and date filter
  const filteredData = historyData
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

  // Sort data based on date filter
  if (dateFilter === 'latest') {
    filteredData.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  } else if (dateFilter === 'oldest') {
    filteredData.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
  }

  const sortOptions = [
    { value: '', label: 'Semua' },
    { value: 'latest', label: 'Terbaru' },
    { value: 'oldest', label: 'Terlama' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">History Penjualan</h1>
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <SearchFilter
          searchCustomer={searchCustomer}
          setSearchCustomer={setSearchCustomer}
          searchSparepart={searchSparepart}
          setSearchSparepart={setSearchSparepart}
        />
        <DateFilter filterDateRange={filterDateRange} setFilterDateRange={setFilterDateRange} />
        <SelectFilter
          options={sortOptions}
          selectedValue={dateFilter}
          onChange={setDateFilter}
          placeholder="Urutkan berdasarkan tanggal"
          className="select select-bordered"
        />
      </div>

      {filteredData.length === 0 ? (
        <Alert
          message="Tidak ada data"
          description="Belum ada data history penjualan yang tersedia."
          type="info"
          showIcon
        />
      ) : (
        <>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID History Penjualan</th>
                <th>ID Penjualan</th>
                <th>Nama Customer</th>
                <th>Nama Sparepart</th>
                <th>Jumlah</th>
                <th>Harga Beli</th>
                <th>Harga Jual</th>
                <th>Margin (%)</th>
                <th>Keuntungan</th>
                <th>Total Harga</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id_history_penjualan}>
                  <td>{item.id_history_penjualan}</td>
                  <td>{item.id_penjualan}</td>
                  <td>{customerMap[item.id_customer] || 'Unknown Customer'}</td>
                  <td>{sparepartMap[item.id_sparepart] || 'Unknown Sparepart'}</td>
                  <td>{item.jumlah}</td>
                  <td>{formatPrice(item.harga_beli)}</td>
                  <td>{formatPrice(item.harga_jual)}</td>
                  <td>
                    {(((item.harga_jual - item.harga_beli) / item.harga_jual) * 100).toFixed(2)}%
                  </td>
                  <td>{formatPrice(item.keuntungan)}</td>
                  <td>{formatPrice(item.total_harga)}</td>
                  <td>{new Date(item.tanggal).toLocaleDateString()}</td>
                </tr>
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
    </div>
  );
};

export default HistoryPenjualan;
