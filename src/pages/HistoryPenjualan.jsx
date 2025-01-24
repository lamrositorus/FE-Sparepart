import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { Table, Spin, Alert, Input, Select } from 'antd';
import { FaExclamationTriangle } from 'react-icons/fa';
import { formatPrice } from '../components/Rupiah';

const { Option } = Select;

export const HistoryPenjualan = () => {
  const [historyData, setHistoryData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [spareparts, setSpareparts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCustomer, setSearchCustomer] = useState('');
  const [searchSparepart, setSearchSparepart] = useState('');
  const [filterDate, setFilterDate] = useState('latest');

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

  const totalKeuntungan = historyData.reduce(
    (total, item) => total + parseFloat(item.keuntungan),
    0
  );

  const customerMap = {};
  customers.forEach((customer) => {
    customerMap[customer.id_customer] = customer.nama_customer;
  });

  const sparepartMap = {};
  spareparts.forEach((sparepart) => {
    sparepartMap[sparepart.id_sparepart] = sparepart.nama_sparepart;
  });

  // Filter data berdasarkan pencarian dan filter tanggal
  const filteredData = historyData
    .filter(item => {
      const customerName = customerMap[item.id_customer] || '';
      const sparepartName = sparepartMap[item.id_sparepart] || '';
      return (
        customerName.toLowerCase().includes(searchCustomer.toLowerCase()) &&
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
      title: 'ID History Penjualan',
      dataIndex: 'id_history_penjualan',
      key: 'id_history_penjualan',
    },
    {
      title: 'ID Penjualan',
      dataIndex: 'id_penjualan',
      key: 'id_penjualan',
    },
    {
      title: 'Nama Customer',
      dataIndex: 'id_customer',
      key: 'id_customer',
      render: (text) => customerMap[text] || 'Unknown Customer',
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
      title: 'Harga Beli',
      dataIndex: 'harga_beli',
      key: 'harga_beli',
      render: (text) => formatPrice(text),
    },
    {
      title: 'Harga Jual',
      dataIndex: 'harga_jual',
      key: 'harga_jual',
      render: (text) => formatPrice(text),
    },
    {
      title: 'Margin (%)',
      dataIndex: 'margin',
      key: 'margin',
      render: (text, record) => {
        const hargaJual = parseFloat(record.harga_jual);
        const hargaBeli = parseFloat(record.harga_beli);
        if (hargaJual > 0) {
          const margin = ((hargaJual - hargaBeli) / hargaJual) * 100;
          return `${margin.toFixed(2)}%`;
        }
        return '0%';
      },
    },
    {
      title: 'Keuntungan',
      dataIndex: 'keuntungan',
      key: 'keuntungan',
      render: (text) => formatPrice(text),
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
      <h1>History Penjualan</h1>
      <Input
        placeholder="Cari Customer"
        value={searchCustomer}
        onChange={(e) => setSearchCustomer(e.target.value)}
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
          description="Belum ada data history penjualan yang tersedia."
          type="info"
          showIcon
        />
      ) : (
        <>
          <Table
            dataSource={filteredData}
            columns={columns}
            rowKey="id_history_penjualan"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
          />
          <div style={{ marginTop: 16, fontWeight: 'bold' }}>
            Total Keuntungan: {formatPrice(totalKeuntungan)}
          </div>
        </>
      )}
    </div>
  );
};