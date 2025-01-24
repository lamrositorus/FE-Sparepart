import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { Table, Spin, Alert, Input, Select } from 'antd';
import { FaExclamationTriangle } from 'react-icons/fa';
import { formatPrice } from '../components/Rupiah';

const { Option } = Select;

export const HistoryPembelian = () => {
  const [historyData, setHistoryData] = useState([]);
  const [pemasok, setPemasok] = useState([]);
  const [spareparts, setSpareparts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchPemasok, setSearchPemasok] = useState('');
  const [searchSparepart, setSearchSparepart] = useState('');
  const [filterDate, setFilterDate] = useState('latest');

  const fetchHistoryPembelian = async () => {
    try {
      const response = await API_Source.getHistoryPembelian();
      setHistoryData(response);
    } catch (error) {
      console.error('Error fetching history pembelian:', error);
      setError(error.message);
    }
  };

  const fetchPemasok = async () => {
    try {
      const data = await API_Source.getPemasok();
      setPemasok(data);
    } catch (error) {
      console.error('Error fetching pemasok:', error);
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
      await Promise.all([fetchHistoryPembelian(), fetchPemasok(), fetchSpareparts()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <Spin size="large" tip="Loading..." />;
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

  const pemasokMap = {};
  pemasok.forEach((item) => {
    pemasokMap[item.id_pemasok] = item.nama_pemasok;
  });

  const sparepartMap = {};
  spareparts.forEach((item) => {
    sparepartMap[item.id_sparepart] = item.nama_sparepart;
  });

  const totalPembelian = historyData.reduce(
    (total, item) => total + parseFloat(item.total_harga),
    0
  );

  // Filter data berdasarkan pencarian dan filter tanggal
  const filteredData = historyData
    .filter(item => {
      const pemasokName = pemasokMap[item.id_pemasok] || '';
      const sparepartName = sparepartMap[item.id_sparepart] || '';
      return (
        pemasokName.toLowerCase().includes(searchPemasok.toLowerCase()) &&
        sparepartName.toLowerCase().includes(searchSparepart.toLowerCase())
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.tanggal);
      const dateB = new Date(b.tanggal);
      return filterDate === 'latest' ? dateB - dateA : dateA - dateB;
    });

  const columns = [
    {
      title: 'ID History Pembelian',
      dataIndex: 'id_history_pembelian',
      key: 'id_history_pembelian',
    },
    {
      title: 'ID Pembelian',
      dataIndex: 'id_pembelian',
      key: 'id_pembelian',
    },
    {
      title: 'Nama Pemasok',
      dataIndex: 'id_pemasok',
      key: 'id_pemasok',
      render: (text) => pemasokMap[text] || 'Unknown Pemasok',
    },
    {
      title: 'Nama Sparepart',
      dataIndex: 'id_sparepart',
      key: 'id_sparepart',
      render: (text) => sparepartMap[text] || 'Unknown Sparepart',
    },
    {
      title: 'Jumlah',
      dataIndex: 'jumlah',
      key: 'jumlah',
    },
    {
      title: 'Total Harga',
      dataIndex: 'total_harga',
      key: 'total_harga',
      render: (text) => formatPrice(text),
    },
    {
      title: 'Tanggal',
      dataIndex: 'tanggal',
      key: 'tanggal',
      render: (text) => new Date(text).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <h1>History Pembelian</h1>
      <Input
        placeholder="Cari Pemasok"
        value={searchPemasok}
        onChange={(e) => setSearchPemasok(e.target.value)}
        style={{ marginBottom: 16, width: 200 }}
      />
      <Input
        placeholder="Cari Sparepart"
        value={searchSparepart}
        onChange={(e) => setSearchSparepart(e.target.value)}
        style={{ marginBottom: 16, width: 200 }}
      />
      <Select
        defaultValue="latest"
        onChange={(value) => setFilterDate(value)}
        style={{ marginBottom: 16, width: 200 }}
      >
        <Option value="latest">Terbaru</Option>
        <Option value="oldest">Terlama</Option>
      </Select>

      {filteredData.length === 0 ? (
        <Alert
          message="Tidak ada data"
          description="Belum ada data history pembelian yang tersedia."
          type="info"
          showIcon
        />
      ) : (
        <>
          <Table
            dataSource={filteredData}
            columns={columns}
            rowKey="id_history_pembelian"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
          />
          <div style={{ marginTop: 16, fontWeight: 'bold' }}>
            Total Pembelian: {formatPrice(totalPembelian)}
          </div>
        </>
      )}
    </div>
  );
};