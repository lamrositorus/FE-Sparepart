import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { FaExclamationTriangle } from 'react-icons/fa';
import { formatPrice } from '../components/Rupiah';
import DateFilter from '../components/DateFilter';
import SearchFilter from '../components/SearchFilterPembelian';
import SelectFilter from '../components/SelectFilter';

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
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const pemasokMap = Object.fromEntries(pemasok.map((item) => [item.id_pemasok, item.nama_pemasok]));
  const sparepartMap = Object.fromEntries(spareparts.map((item) => [item.id_sparepart, item.nama_sparepart]));

  const filteredData = historyData.filter((item) => {
    const pemasokName = pemasokMap[item.id_pemasok] || '';
    const sparepartName = sparepartMap[item.id_sparepart] || '';
    return (
      pemasokName.toLowerCase().includes(searchPemasok.toLowerCase()) &&
      sparepartName.toLowerCase().includes(searchSparepart.toLowerCase())
    );
  }).filter((item) => {
    if (!filterDateRange[0] || !filterDateRange[1]) return true;
    const itemDate = new Date(item.tanggal);
    return itemDate >= filterDateRange[0] && itemDate <= filterDateRange[1];
  });

  if (dateFilter === 'latest') filteredData.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  if (dateFilter === 'oldest') filteredData.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

  const totalPembelian = filteredData.reduce((total, item) => total + parseFloat(item.total_harga || 0), 0);

  return (
    <div className="p-6  text-white rounded-lg">
      <h1 className="text-3xl font-bold mb-4">History Pembelian</h1>
      <SearchFilter searchPemasok={searchPemasok} setSearchPemasok={setSearchPemasok} searchSparepart={searchSparepart} setSearchSparepart={setSearchSparepart} />
      <DateFilter filterDateRange={filterDateRange} setFilterDateRange={setFilterDateRange} />
      <SelectFilter options={[{ value: '', label: 'Semua' }, { value: 'latest', label: 'Terbaru' }, { value: 'oldest', label: 'Terlama' }]} selectedValue={dateFilter} onChange={setDateFilter} />
      {filteredData.length === 0 ? (
        <div className="alert alert-info mt-4">
          <span>Belum ada data history pembelian yang tersedia.</span>
        </div>
      ) : (
        <div className="overflow-x-auto mt-4">
          <table className="table  w-full">
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
              {filteredData.map((item) => (
                <tr key={item.id_history_pembelian}>
                  <td>{item.id_history_pembelian}</td>
                  <td>{item.id_pembelian}</td>
                  <td>{pemasokMap[item.id_pemasok] || 'Unknown Pemasok'}</td>
                  <td>{sparepartMap[item.id_sparepart] || 'Unknown Sparepart'}</td>
                  <td>{item.jumlah}</td>
                  <td>{formatPrice(item.total_harga)}</td>
                  <td>{new Date(item.tanggal).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 font-bold text-lg">Total Pembelian: {formatPrice(totalPembelian)}</div>
        </div>
      )}
    </div>
  );
};

export default HistoryPembelian;