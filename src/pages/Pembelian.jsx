import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { Table, Spin, Alert, Button, Select, DatePicker, Input } from 'antd'; // Mengimpor komponen dari Ant Design
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
import { formatPrice } from '../components/Rupiah';
import PembelianModal from '../components/ModalPembelian';
import format from 'date-fns/format';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const { Option } = Select;
const { RangePicker } = DatePicker;

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
    status: 'Pending', // Default status
  });
  const [filterStatus, setFilterStatus] = useState('All'); // State untuk filter status
  const [filterDateRange, setFilterDateRange] = useState([null, null]); // State untuk filter tanggal
  const [searchSparepart, setSearchSparepart] = useState(''); // State untuk pencarian sparepart
  const [searchPemasok, setSearchPemasok] = useState(''); // State untuk pencarian pemasok

  const fetchData = async () => {
    try {
      const [pembelianData, pemasokData, sparepartData] = await Promise.all([
        API_Source.getPembelian(),
        API_Source.getPemasok(),
        API_Source.getSparepart(),
      ]);
      setPembelianList(pembelianData || []);

      // Create a map of Supplier ID to Supplier Name
      const pemasokMapping = {};
      pemasokData.forEach((pemasok) => {
        pemasokMapping[pemasok.id_pemasok] = pemasok.nama_pemasok;
      });
      setPemasokMap(pemasokMapping);

      // Create a map of Sparepart ID to Sparepart Name
      const sparepartMapping = {};
      sparepartData.forEach((sparepart) => {
        sparepartMapping[sparepart.id_sparepart] = sparepart.nama_sparepart;
      });
      setSparepartMap(sparepartMapping);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddPembelian = async (data) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to add this purchase?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, add it!',
    });

    if (result.isConfirmed) {
      try {
        const newPembelian = await API_Source.postPembelian(
          data.id_sparepart,
          data.id_pemasok,
          data.tanggal,
          data.jumlah,
          data.status
        );
        console.log('New Purchase added:', newPembelian);
        fetchData(); // Refresh the list after adding
        setPembelianData({
          id_sparepart: '',
          id_pemasok: '',
          tanggal: '',
          jumlah: '',
          status: 'Pending',
        });
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Purchase added successfully!',
        });
      } catch (error) {
        console.error('Error adding purchase:', error.message);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
        });
      }
    }
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

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to change the status to "${newStatus}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!',
    });

    if (result.isConfirmed) {
      try {
        await API_Source.putPembelian(id, newStatus);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Status updated successfully!',
        });
        fetchData(); // Refresh the list after updating
      } catch (error) {
        console.error('Error updating status:', error.message);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
        });
      }
    }
  };

  if (loading) {
    return <Spin size="large" tip="Loading..." />; // Menampilkan spinner loading dari Ant Design
  }

  // Filter data berdasarkan status, tanggal, sparepart, dan pemasok
  const filteredPembelianList = pembelianList
    .filter(item => filterStatus === 'All' || item.status === filterStatus)
    .filter(item => {
      if (!filterDateRange[0] || !filterDateRange[1]) return true; // Jika tidak ada filter tanggal, tampilkan semua
      const itemDate = new Date(item.tanggal);
      return itemDate >= filterDateRange[0] && itemDate <= filterDateRange[1];
    })
    .filter(item => {
      const sparepartName = sparepartMap[item.id_sparepart] || '';
      const pemasokName = pemasokMap[item.id_pemasok] || '';
      return (
        sparepartName.toLowerCase().includes(searchSparepart.toLowerCase()) &&
        pemasokName.toLowerCase().includes(searchPemasok.toLowerCase())
      );
    });

  const columns = [
    {
      title: 'No',
      render: (text, record, index) => index + 1,
      align: 'center',
    },
    {
      title: 'Nama Pemasok',
      dataIndex: 'id_pemasok',
      render: (text) => pemasokMap[text] || 'Unknown Pemasok',
    },
    {
      title: 'Nama Sparepart',
      dataIndex: 'id_sparepart',
      render: (text) => sparepartMap[text] || 'Unknown Sparepart',
    },
    {
      title: 'Jumlah',
      dataIndex: 'jumlah',
      align: 'center',
    },
    {
      title: 'Tanggal',
      dataIndex: 'tanggal',
      render: (text) => format(new Date(text), 'dd/MM/yyyy'),
      align: 'center',
    },
    {
      title: 'Total Harga',
      dataIndex: 'total_harga',
      render: (text) => formatPrice(text),
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text, record) => (
        <span className="flex items-center justify-center">
          {text === 'Pending' && <FaHourglassHalf className="text-yellow-500 cursor-pointer" onClick={() => handleUpdateStatus(record.id_pembelian, text)} />}
          {text === 'Selesai' && <FaCheckCircle className="text-green-500 cursor-pointer" onClick={() => handleUpdateStatus(record.id_pembelian, text)} />}
          {text === 'Dibatalkan' && <FaTimesCircle className="text-red-500 cursor-pointer" onClick={() => handleUpdateStatus(record.id_pembelian, text)} />}
          <span className="ml-2">{text}</span>
        </span>
      ),
      align: 'center',
    },
    {
      title: 'Aksi',
      render: (text, record) => (
        <Link to={`${record.id_pembelian}`} className="text-blue-600 underline hover:text-blue-800">Detail</Link>
      ),
      align: 'center',
    },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">Daftar Pembelian</h1>
      <div className="mb-4">
        <Select
          defaultValue="All"
          style={{ width: 120, marginRight: 16 }}
          onChange={value => setFilterStatus(value)}
        >
          <Option value="All">All</Option>
          <Option value="Pending">Pending</Option>
          <Option value="Selesai">Selesai</Option>
          <Option value="Dibatalkan">Dibatalkan</Option>
        </Select>
        <RangePicker
          onChange={dates => setFilterDateRange(dates)}
          format="DD/MM/YYYY"
        />
        <Input
          placeholder="Cari Sparepart"
          style={{ width: 200, marginLeft: 16 }}
          onChange={e => setSearchSparepart(e.target.value)}
        />
        <Input
          placeholder="Cari Pemasok"
          style={{ width: 200, marginLeft: 16 }}
          onChange={e => setSearchPemasok(e.target.value)}
        />
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
          <Table
            dataSource={filteredPembelianList}
            columns={columns}
            rowKey="id_pembelian"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
          />
          <div style={{ marginTop: 16, fontWeight: 'bold' }}>
            <Button type="primary" onClick={() => setModalOpen(true)}>
              Add Purchase
            </Button>
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
    </div>
  );
};

export default Pembelian;