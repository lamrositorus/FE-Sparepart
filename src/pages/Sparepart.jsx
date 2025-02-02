import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { Spin, Alert, Button } from 'antd';
import { FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { formatPrice } from '../components/Rupiah';
import Modal from '../components/ModalSparepart';
import EditSparepartModal from '../components/EditSparepartModal';
import format from 'date-fns/format';
import Swal from 'sweetalert2';
import DateFilter from '../components/DateFilter';
import SearchFilter from '../components/SearchFilterSparepart';
import SelectFilter from '../components/SelectFilter';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast notifications
import ConfirmationModal from '../components/ConfirmationModal'; // Import the ConfirmationModal

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
  const [filterDateRange, setFilterDateRange] = useState([null, null]);
  const [dateFilter, setDateFilter] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false); // State for confirmation modal
  const [actionType, setActionType] = useState(''); // State to determine the action type (add/update)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const spareparts = await API_Source.getSparepart();
        const categories = await API_Source.getKategori();
        const suppliers = await API_Source.getPemasok();

        spareparts.sort((a, b) => new Date(b.tanggal_masuk) - new Date(a.tanggal_masuk));

        setSparepartList(spareparts);
        setKategoriList(categories);
        setPemasokList(suppliers);
      } catch (err) {
        Swal.fire('Error!', err.message || 'Failed to fetch data.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddSparepart = () => {
    setActionType('add');
    setConfirmModalOpen(true); // Open confirmation modal
  };

  const handleUpdateSparepart = () => {
    setActionType('update');
    setConfirmModalOpen(true); // Open confirmation modal
  };

  const confirmAddSparepart = async () => {
    const tanggal_masuk = new Date().toISOString();
    try {
      await API_Source.postSparepart(
        sparepartData.namaSparepart,
        sparepartData.harga,
        sparepartData.margin,
        sparepartData.stok,
        sparepartData.selectedKategori,
        sparepartData.selectedPemasok,
        sparepartData.deskripsi,
        tanggal_masuk
      );
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
      updatedSpareparts.sort((a, b) => new Date(b.tanggal_masuk) - new Date(a.tanggal_masuk));
      setSparepartList(updatedSpareparts);
      toast.success('Sparepart added successfully!'); // Use toast for success
      setConfirmModalOpen(false); // Close confirmation modal
    } catch (error) {
      toast.error(error || 'Failed to add sparepart.'); // Use toast for error
    }
  };

  const confirmUpdateSparepart = async () => {
    try {
      await API_Source.updatedSparepart(
        editSparepartData.id,
        editSparepartData.nama_sparepart,
        editSparepartData.harga,
        editSparepartData.margin,
        editSparepartData.stok,
        editSparepartData.id_kategori,
        editSparepartData.id_pemasok,
        editSparepartData.deskripsi,
        editSparepartData.tanggal_masuk
      );
      toast.success('Sparepart updated successfully!'); // Use toast for success
      setEditModalOpen(false);
      setConfirmModalOpen(false); // Close confirmation modal
      const updatedSpareparts = await API_Source.getSparepart();
      updatedSpareparts.sort((a, b) => new Date(b.tanggal_masuk) - new Date(a.tanggal_masuk));
      setSparepartList(updatedSpareparts);
    } catch (error) {
      toast.error(error || 'Failed to update sparepart.'); // Use toast for error
    }
  };

  const filteredSpareparts = sparepartList.filter((sparepart) => {
    const isWithinDateRange = () => {
      if (!filterDateRange[0] || !filterDateRange[1]) return true;
      const itemDate = new Date(sparepart.tanggal_masuk);
      return itemDate >= filterDateRange[0] && itemDate <= filterDateRange[1];
    };

    return (
      sparepart.nama_sparepart.toLowerCase().includes(searchTerm.toLowerCase()) &&
      isWithinDateRange()
    );
  });

  if (loading) {
    return <Spin size="large" tip="Loading..." />;
  }

  if (dateFilter === 'latest') {
    filteredSpareparts.sort((a, b) => new Date(b.tanggal_masuk) - new Date(a.tanggal_masuk));
  } else if (dateFilter === 'oldest') {
    filteredSpareparts.sort((a, b) => new Date(a.tanggal_masuk) - new Date(b.tanggal_masuk));
  }

  const sortOptions = [
    { value: '', label: 'Semua' },
    { value: 'latest', label: 'Terbaru' },
    { value: 'oldest', label: 'Terlama' },
  ];

  return (
    <div className="text-secondary p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-400">Daftar Sparepart</h1>
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <SearchFilter searchSparepart={searchTerm} setSearchSparepart={setSearchTerm} />
        <DateFilter filterDateRange={filterDateRange} setFilterDateRange={setFilterDateRange} />
        <SelectFilter
          options={sortOptions}
          selectedValue={dateFilter}
          onChange={setDateFilter}
          placeholder="Urutkan berdasarkan tanggal"
        />
        <Button type="primary" onClick={() => setModalOpen(true)} className="ml-auto btn btn-primary">
          Add Sparepart
        </Button>
      </div>
      {filteredSpareparts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Sparepart</th>
                <th>Deskripsi</th>
                <th>Harga</th>
                <th>Harga Jual</th>
                <th>Margin (%)</th>
                <th>Stok</th>
                <th>Tanggal Masuk</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredSpareparts.map((record, index) => (
                <tr key={record.id_sparepart} className="hover">
                  <th>{index + 1}</th>
                  <td>
                    <Link
                      to={`/sparepart/${record.id_sparepart}`}
                      className="text-blue-600 font-bold underline"
                    >
                      {record.nama_sparepart}
                    </Link>
                  </td>
                  <td>{record.deskripsi}</td>
                  <td>{formatPrice(record.harga)}</td>
                  <td>{formatPrice(record.harga_jual)}</td>
                  <td className="text-center">{record.margin}%</td>
                  <td className="text-center">{record.stok}</td>
                  <td>{format(new Date(record.tanggal_masuk), 'dd/MM/yyyy')}</td>
                  <td>
                    <Button
                      type="link"
                      onClick={() => {
                        setEditSparepartData(record);
                        setEditModalOpen(true);
                      }}
                    >
                      <FaEdit className="text-blue-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
        onAddSparepart={() => {
          setActionType('add');
          setConfirmModalOpen(true); // Open confirmation modal on submit
        }}
        sparepartData={{ ...sparepartData, kategoriList, pemasokList }}
        setSparepartData={setSparepartData}
      />
      <EditSparepartModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdateSparepart={() => {
          setActionType('update');
          setConfirmModalOpen(true); // Open confirmation modal on submit
        }}
        sparepartData={editSparepartData}
        kategoriList={kategoriList}
        pemasokList={pemasokList}
      />
      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={actionType === 'add' ? confirmAddSparepart : confirmUpdateSparepart}
        message={actionType === 'add' ? 'Apakah Anda yakin ingin menambahkan sparepart ini?' : 'Apakah Anda yakin ingin memperbarui sparepart ini?'}
      />
      <ToastContainer /> {/* Add ToastContainer for notifications */}
    </div>
  );
}