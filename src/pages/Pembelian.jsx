import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { Spin, Alert, Button } from 'antd';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
import { formatPrice } from '../components/Rupiah';
import PembelianModal from '../components/ModalPembelian';
import format from 'date-fns/format';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import DateFilter from '../components/DateFilter';
import SelectFilter from '../components/SelectFilter';
import SearchFilter from '../components/SearchFilterPembelian'; // Import the SearchFilter component

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
    status: 'Pending',
  });
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDateRange, setFilterDateRange] = useState([null, null]);
  const [searchSparepart, setSearchSparepart] = useState('');
  const [searchPemasok, setSearchPemasok] = useState('');
  const [dateFilter, setDateFilter] = useState(null);

  const fetchData = async () => {
    try {
      const [pembelianData, pemasokData, sparepartData] = await Promise.all([
        API_Source.getPembelian(),
        API_Source.getPemasok(),
        API_Source.getSparepart(),
      ]);
      setPembelianList(pembelianData || []);

      const pemasokMapping = {};
      pemasokData.forEach((pemasok) => {
        pemasokMapping[pemasok.id_pemasok] = pemasok.nama_pemasok;
      });
      setPemasokMap(pemasokMapping);

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
        await API_Source.postPembelian(
          data.id_sparepart,
          data.id_pemasok,
          data.tanggal,
          data.jumlah,
          data.status
        );
        fetchData();
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
        fetchData();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
        });
      }
    }
  };

  if (loading) {
    return <Spin size="large" tip="Loading..." />;
  }

  const filteredPembelianList = pembelianList
    .filter((item) => filterStatus === 'All' || item.status === filterStatus)
    .filter((item) => {
      if (!filterDateRange[0] || !filterDateRange[1]) return true;
      const itemDate = new Date(item.tanggal);
      return itemDate >= filterDateRange[0] && itemDate <= filterDateRange[1];
    })
    .filter((item) => {
      const sparepartName = sparepartMap[item.id_sparepart] || '';
      const pemasokName = pemasokMap[item.id_pemasok] || '';
      return (
        sparepartName.toLowerCase().includes(searchSparepart.toLowerCase()) &&
        pemasokName.toLowerCase().includes(searchPemasok.toLowerCase())
      );
    });

  if (dateFilter === 'latest') {
    filteredPembelianList.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  } else if (dateFilter === 'oldest') {
    filteredPembelianList.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
  }

  const sortOptions = [
    { value: '', label: 'Semua' },
    { value: 'latest', label: 'Terbaru' },
    { value: 'oldest', label: 'Terlama' },
  ];

  const statusOptions = [
    { value: 'All', label: 'All' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Selesai', label: 'Selesai' },
    { value: 'Dibatalkan', label: 'Dibatalkan' },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">Daftar Pembelian</h1>
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <SelectFilter
          options={statusOptions}
          selectedValue={filterStatus}
          onChange={setFilterStatus}
          placeholder="Filter Status"
        />
        <SelectFilter
          options={sortOptions}
          selectedValue={dateFilter}
          onChange={setDateFilter}
          placeholder="Urutkan berdasarkan tanggal"
        />
        <DateFilter filterDateRange={filterDateRange} setFilterDateRange={setFilterDateRange} />
        <SearchFilter
          searchPemasok={searchPemasok}
          setSearchPemasok={setSearchPemasok}
          searchSparepart={searchSparepart}
          setSearchSparepart={setSearchSparepart}
        />
        <div className="flex gap-2 justify-stretch w-full">
        <Link to={'/historypembelian'} type="primary" className="btn btn-info text-white">
          History pembelian
        </Link>
        <Button type="primary" onClick={() => setModalOpen(true)} className="ml-auto btn btn-primary text-white">
          Add purchase
        </Button>
        </div>
      </div>
      {filteredPembelianList.length === 0 ? (
        <Alert
          message="Tidak ada data"
          description="Belum ada data pembelian yang tersedia."
          type="info"
          showIcon
        />
      ) : (
        <table className="table w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Pemasok</th>
              <th>Nama Sparepart</th>
              <th>Jumlah</th>
              <th>Tanggal</th>
              <th>Total Harga</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredPembelianList.map((item, index) => (
              <tr key={item.id_pembelian}>
                <td className="text-center">{index + 1}</td>
                <td>{pemasokMap[item.id_pemasok] || 'Unknown Pemasok'}</td>
                <td>{sparepartMap[item.id_sparepart] || 'Unknown Sparepart'}</td>
                <td className="text-center">{item.jumlah}</td>
                <td>{format(new Date(item.tanggal), 'dd/MM/yyyy')}</td>
                <td>{formatPrice(item.total_harga)}</td>
                <td className="text-center">
                  <span className="flex items-center justify-center">
                    {item.status === 'Pending' && (
                      <FaHourglassHalf
                        className="text-yellow-500 cursor-pointer"
                        onClick={() => handleUpdateStatus(item.id_pembelian, item.status)}
                      />
                    )}
                    {item.status === 'Selesai' && (
                      <FaCheckCircle
                        className="text-green-500 cursor-pointer"
                        onClick={() => handleUpdateStatus(item.id_pembelian, item.status)}
                      />
                    )}
                    {item.status === 'Dibatalkan' && (
                      <FaTimesCircle
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleUpdateStatus(item.id_pembelian, item.status)}
                      />
                    )}
                    <span className="ml-2">{item.status}</span>
                  </span>
                </td>
                <td className="text-center">
                  <Link to={`${item.id_pembelian}`} className="btn btn-link">
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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