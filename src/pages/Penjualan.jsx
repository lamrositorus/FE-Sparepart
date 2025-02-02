import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
import PenjualanModal from '../components/ModalPenjual'; // Import modal
import format from 'date-fns/format';
import Swal from 'sweetalert2'; // Import SweetAlert2
import DateFilter from '../components/DateFilter'; // Import the DateFilter component
import SelectFilter from '../components/SelectFilter';
import SearchFilter from '../components/SearchFilterPenjualan';
import { Link } from 'react-router-dom';
import { formatPrice } from '../components/Rupiah';
import { Button, Alert } from 'antd'; // Import components from Ant Design

export const Penjualan = () => {
  const [penjualanList, setPenjualanList] = useState([]); // Initialize as an empty array
  const [customerMap, setCustomerMap] = useState({});
  const [sparepartMap, setSparepartMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState(null);
  const [penjualanData, setPenjualanData] = useState({
    id_sparepart: '',
    id_customer: '',
    tanggal: '',
    jumlah: '',
    metode_pembayaran: 'Tunai', // Default payment method
  });
  const [searchCustomer, setSearchCustomer] = useState(''); // State for customer search input
  const [searchSparepart, setSearchSparepart] = useState(''); // State for sparepart search input
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
    return (
      <div className="loading loading-spinner loading-lg"></div>
    );
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
    })
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)); // Sort by date descending

  if (dateFilter === 'latest') {
    filteredPenjualanList.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  } else if (dateFilter === 'oldest') {
    filteredPenjualanList.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
  }

  const sortOptions = [
    { value: '', label: 'Semua' },
    { value: 'latest', label: 'Terbaru' },
    { value: 'oldest', label: 'Terlama' },
  ];

  return (
    <div className=" text-white p-6">
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
        <Link to={'/historypenjualan'} type="primary" className="btn btn-info text-white">
          History penjualan
        </Link>
        <Button type="primary" onClick={() => setModalOpen(true)} className="ml-auto btn btn-primary text-white">
          Add Sale
        </Button>
        </div>
      </div>
      {filteredPenjualanList.length > 0 ? (
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
            {filteredPenjualanList.map((item, index) => (
              <tr key={item.id_penjualan}>
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
              </tr>
            ))}
          </tbody>
        </table>
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