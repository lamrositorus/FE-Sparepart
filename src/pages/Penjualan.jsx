import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { Table, Spin, Alert, Button, Input, Select, DatePicker } from 'antd'; // Import komponen dari Ant Design
import { Link } from 'react-router-dom';
import { formatPrice } from '../components/Rupiah';
import PenjualanModal from '../components/ModalPenjual'; // Import modal
import format from 'date-fns/format';
import Swal from 'sweetalert2'; // Import SweetAlert2

const { Option } = Select;
const { RangePicker } = DatePicker;

export const Penjualan = () => {
  const [penjualanList, setPenjualanList] = useState([]); // Initialize as an empty array
  const [customerMap, setCustomerMap] = useState({});
  const [sparepartMap, setSparepartMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [penjualanData, setPenjualanData] = useState({
    id_sparepart: '',
    id_customer: '',
    tanggal: '',
    jumlah: '',
    metode_pembayaran: 'Tunai', // Default payment method
  });
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [filterDateRange, setFilterDateRange] = useState([null, null]); // State for filter date range

  const fetchData = async () => {
    try {
      const [penjualanData, customerData, sparepartData] = await Promise.all([
        API_Source.getPenjualan(),
        API_Source.getCustomer(),
        API_Source.getSparepart(),
      ]);
      setPenjualanList(penjualanData || []); // Ensure we set it to an empty array if null

      // Create a map of Customer ID to Customer Name
      const customerMapping = {};
      customerData.forEach((customer) => {
        customerMapping[customer.id_customer] = customer.nama_customer;
      });
      setCustomerMap(customerMapping);

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

  const handleAddPenjualan = async (data) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to add this sale?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, add it!',
    });

    if (result.isConfirmed) {
      try {
        const newPenjualan = await API_Source.postPenjualan(
          data.id_sparepart,
          data.id_customer,
          data.tanggal,
          data.jumlah,
          data.metode_pembayaran
        );
        console.log('New Sale added:', newPenjualan);
        fetchData(); // Refresh the list after adding
        setPenjualanData({
          id_sparepart: '',
          id_customer: '',
          tanggal: '',
          jumlah: '',
          metode_pembayaran: 'Tunai', // Reset to default
        });
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Sale added successfully!',
        });
      } catch (error) {
        console.error('Error adding sale:', error.message);
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

  // Filter and sort the penjualanList based on search term and date range
  const filteredPenjualanList = penjualanList
    .filter((item) => {
      const customerName = customerMap[item.id_customer] || '';
      const sparepartName = sparepartMap[item.id_sparepart] || '';
      return (
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sparepartName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .filter(item => {
      if (!filterDateRange[0] || !filterDateRange[1]) return true; // If no date filter, show all
      const itemDate = new Date(item.tanggal);
      return itemDate >= filterDateRange[0] && itemDate <= filterDateRange[1];
    })
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)); // Sort by date descending

  // Definisikan kolom untuk tabel
  const columns = [
    {
      title: 'No',
      key: 'index',
      render: (_, __, index) => index + 1,
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
      render: (text) => <div style={{ textAlign: 'center' }}>{text}</div>,
    },
    {
      title: 'Tanggal',
      dataIndex: 'tanggal',
      key: 'tanggal',
      render: (text) => format(new Date(text), 'dd/MM/yyyy'),
    },
    {
      title: 'Total Harga',
      dataIndex: 'total_harga',
      key: 'total_harga',
      render: (text) => formatPrice(text),
    },
    {
      title: 'Metode Pembayaran',
      dataIndex: 'metode_pembayaran',
      key: 'metode_pembayaran',
      render: (text) => <div style={{ textAlign: 'center' }}>{text}</div>,
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (text, record) => (
        <Link to={`/penjualan/${record.id_penjualan}`} className="text-blue-600 underline hover:text-blue-800">Detail</Link>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">Daftar Penjualan</h1>
      <Input
        placeholder="Search by Customer or Sparepart"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <RangePicker
        onChange={dates => setFilterDateRange(dates)}
        format="DD/MM/YYYY"
        style={{ marginBottom: 16 }}
      />
      {filteredPenjualanList.length > 0 ? (
        <>
          <Table
            dataSource={filteredPenjualanList}
            columns={columns}
            rowKey="id_penjualan"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
          />
          <div style={{ marginTop: 16, fontWeight: 'bold' }}>
 <Button type="primary" onClick={() => setModalOpen(true)}>Add Sale</Button>
          </div>
        </>
      ) : (
        <Alert
          message="Tidak ada penjualan"
          description="Belum ada data penjualan yang tersedia."
          type="info"
          showIcon
          style={{ marginTop: 16 }}
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
    </div>
  );
};

export default Penjualan;