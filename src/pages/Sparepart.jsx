import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { Table, Spin, Alert, Button, DatePicker } from 'antd'; // Mengimpor komponen dari Ant Design
import { FaEdit } from 'react-icons/fa'; // Import ikon edit
import { Link } from 'react-router-dom';
import { formatPrice } from '../components/Rupiah';
import Modal from '../components/ModalSparepart';
import EditSparepartModal from '../components/EditSparepartModal';
import format from 'date-fns/format';
import Swal from 'sweetalert2'; // Import SweetAlert2

const { RangePicker } = DatePicker;

export const Sparepart = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [sparepartData, setSparepartData] = useState({
    namaSparepart: '',
    harga: '',
    margin: '',
    stok: '',
    deskripsi: '',
    selectedKategori: '',
    selectedPemasok: '',
  });
  const [editSparepartData, setEditSparepartData] = useState(null);
  const [sparepartList, setSparepartList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [pemasokList, setPemasokList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDateRange, setFilterDateRange] = useState([null, null]); // State untuk rentang tanggal

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const spareparts = await API_Source.getSparepart();
        const categories = await API_Source.getKategori();
        const suppliers = await API_Source.getPemasok();
        
        // Mengurutkan spareparts berdasarkan tanggal masuk terbaru hingga terlama
        spareparts.sort((a, b) => new Date(b.tanggal_masuk) - new Date(a.tanggal_masuk));

        setSparepartList(spareparts);
        setKategoriList(categories);
        setPemasokList(suppliers);
      } catch (err) {
        Swal.fire('Error!', 'Failed to fetch data. Please try again later.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddSparepart = async (data) => {
    const tanggal_masuk = new Date().toISOString();
    try {
      const newSparepart = await API_Source.postSparepart(
        data.namaSparepart,
        data.harga,
        data.margin,
        data.stok,
        data.selectedKategori,
        data.selectedPemasok,
        data.deskripsi,
        tanggal_masuk
      );
      console.log('New Sparepart added:', newSparepart);
      setSparepartData({
        namaSparepart: '',
        harga: '',
        margin: '',
        stok: '',
        deskripsi: '',
        selectedKategori: '',
        selectedPemasok: '',
      });
      const updatedSpareparts = await API_Source.getSparepart();
      // Mengurutkan spareparts setelah penambahan
      updatedSpareparts.sort((a, b) => new Date(b.tanggal_masuk) - new Date(a.tanggal_masuk));
      setSparepartList(updatedSpareparts);
    } catch (error) {
      console.error('Error adding sparepart:', error.message);
      Swal.fire('Error!', error.message || 'Gagal menambahkan sparepart.', 'error');
    }
  };

  const handleUpdateSparepart = async (data) => {
    try {
      await API_Source.updatedSparepart(
        data.id,
        data.nama_sparepart,
        data.harga,
        data.margin,
        data.stok,
        data.id_kategori,
        data.id_pemasok,
        data.deskripsi,
        data.tanggal_masuk
      );
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Sparepart updated successfully!',
      });
      setEditModalOpen(false);
      const updatedSpareparts = await API_Source.getSparepart();
      // Mengurutkan spareparts setelah pembaruan
      updatedSpareparts.sort((a, b) => new Date(b.tanggal_masuk) - new Date(a.tanggal_masuk));
      setSparepartList(updatedSpareparts);
    } catch (error) {
      console.error('Error updating sparepart:', error.message);
      Swal.fire('Error!', error.message || 'Gagal memperbarui sparepart.', 'error');
    }
  };

  const confirmAddSparepart = async (data) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to add this spare part?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, add it!',
      cancelButtonText: 'No, cancel!',
    });

    if (result.isConfirmed) {
      await handleAddSparepart(data);
    }
  };

  const confirmUpdateSparepart = async (data) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this spare part?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel!',
    });

    if (result.isConfirmed) {
      await handleUpdateSparepart(data);
    }
  };

  // Filter spare parts based on the search term and date range
  const filteredSpareparts = sparepartList.filter(sparepart => {
    const isWithinDateRange = () => {
      if (!filterDateRange[0] || !filterDateRange[1]) return true; // Jika tidak ada filter tanggal, tampilkan semua
      const itemDate = new Date(sparepart.tanggal_masuk);
      return itemDate >= filterDateRange[0] && itemDate <= filterDateRange[1];
    };

    return (
      sparepart.nama_sparepart.toLowerCase().includes(searchTerm.toLowerCase()) &&
      isWithinDateRange()
    );
  });

  if (loading) {
    return <Spin size="large" tip="Loading..." />; // Menampilkan spinner loading dari Ant Design
  }

  // Definisikan kolom untuk tabel
  const columns = [
    {
      title: 'No',
      key: 'index',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Nama Sparepart',
      dataIndex: 'nama_sparepart',
      key: 'nama_sparepart',
      render: (text, record) => (
        <Link to={`/sparepart/${record.id_sparepart}`} className="text-blue-600 font-bold underline">
          {text}
        </Link>
      ),
    },
    {
      title: 'Deskripsi',
      dataIndex: 'deskripsi',
      key: 'deskripsi',
    },
    {
      title: 'Harga',
      dataIndex: 'harga',
      key: 'harga',
      render: (text) => formatPrice(text),
    },
    {
      title: 'Harga Jual',
      dataIndex: 'harga_jual',
      key: 'harga_jual',
      render: (text) => formatPrice(text),
    },
    {
      title: 'Stok',
      dataIndex: 'stok',
      key: 'stok',
      render: (text) => <div style={{ textAlign: 'center' }}>{text}</div>,
    },
    {
      title: 'Tanggal Masuk',
      dataIndex: 'tanggal_masuk',
      key: 'tanggal_masuk',
      render: (text) => format(new Date(text), 'dd/MM/yyyy'),
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (text, record) => (
        <div>
          <Button
            type="link"
            onClick={() => {
              setEditSparepartData(record);
              setEditModalOpen(true);
            }}
          >
            <FaEdit className="text-blue-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">Daftar Sparepart</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Sparepart..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <RangePicker
          onChange={dates => setFilterDateRange(dates)}
          format="DD/MM/YYYY"
          style={{ marginTop: 16, width: '20%' }}
        />
      </div>
      {filteredSpareparts.length > 0 ? (
        <>
          <Table
            dataSource={filteredSpareparts}
            columns={columns}
            rowKey="id_sparepart"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
          />
          <div style={{ marginTop: 16 }}>
            <Button type="primary" onClick={() => setModalOpen(true)}>Add Sparepart</Button>
          </div>
        </>
      ) : (
        <Alert
          message="Tidak ada sparepart"
          description="Belum ada data sparepart yang tersedia."
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddSparepart={confirmAddSparepart}
        sparepartData={{ ...sparepartData, kategoriList, pemasokList }}
        setSparepartData={setSparepartData}
      />
      <EditSparepartModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdateSparepart={confirmUpdateSparepart}
        sparepartData={editSparepartData}
        kategoriList={kategoriList}
        pemasokList={pemasokList}
      />
    </div>
  );
};

export default Sparepart;