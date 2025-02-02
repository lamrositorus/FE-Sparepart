import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { motion } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';
import { formatPrice } from '../components/Rupiah';
import DateFilter from '../components/DateFilter'; // Import the DateFilter component
import SearchFilter from '../components/SearchFilterPenjualan'; // Import the SearchFilter component
import { Select, Alert } from 'antd'; // Import components from Ant Design
import SelectFilter from '../components/SelectFilter';
const { Option } = Select;

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

  const fetchHistoryPenjualan = async () => {
    try {
      const data = await API_Source.getHistoryPenjualan();
      setHistoryData(data);
    } catch (error) {
      console.error('Error fetching history penjualan:', error);
      setError(error.message);
    }
  };

  const fetchCustomers = async () => {
    try {
      const data = await API_Source.getCustomer();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError(error.message);
    }
  };

  const fetchSpareparts = async () => {
    try {
      const data = await API_Source.getSparepart();
      setSpareparts(data);
    } catch (error) {
      console.error('Error fetching spareparts:', error);
      setError(error.message);
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
    return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
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
  // Inside the HistoryPenjualan component
const sortOptions = [
  { value: '', label: 'Semua' },
  { value: 'latest', label: 'Terbaru' },
  { value: 'oldest', label: 'Terlama' },
];

  return (
    <div className=" text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">History Penjualan</h1>
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
/>

      {filteredData.length === 0 ? (
        <Alert
          message="Tidak ada data"
          description="Belum ada data history penjualan yang tersedia."
          type="info"
          showIcon
        />
      ) : (
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
            {filteredData.map((item) => (
              <tr key={item.id_history_penjualan}>
                <td>{item.id_history_penjualan}</td>
                <td>{item.id_penjualan}</td>
                <td>{customerMap[item.id_customer] || 'Unknown Customer'}</td>
                <td>{sparepartMap[item.id_sparepart] || 'Unknown Sparepart'}</td>
                <td>{item.jumlah}</td>
                <td>{formatPrice(item.harga_beli)}</td>
                <td>{formatPrice(item.harga_jual)}</td>
                <td>
                  {((item.harga_jual - item.harga_beli) / item.harga_jual * 100).toFixed(2)}%
                </td>
                <td>{formatPrice(item.keuntungan)}</td>
                <td>{new Date(item.tanggal).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HistoryPenjualan;