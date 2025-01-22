import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaTag,
  FaUser ,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from 'react-icons/fa'; // Importing icons
import { format } from 'date-fns';
import Breadcrumb from '../components/BreadCumb'; // Importing Breadcrumb component

// Komponen untuk menampilkan ikon status
const StatusIcon = ({ status }) => {
  let icon;
  let color;

  switch (status) {
    case 'Selesai':
      icon = <FaCheckCircle />;
      color = 'text-green-500';
      break;
    case 'Pending':
      icon = <FaClock />;
      color = 'text-yellow-500';
      break;
    case 'Dibatalkan':
      icon = <FaTimesCircle />;
      color = 'text-red-500';
      break;
    default:
      icon = null;
      color = '';
  }

  return (
    <div className={`flex items-center ${color}`}>
      {icon}
      <span className="ml-2">{status}</span>
    </div>
  );
};

export const DetailPembelian = () => {
  const [pembelianDetails, setPembelianDetails] = useState(null);
  const [sparepartName, setSparepartName] = useState('Sparepart XYZ');
  const [pemasokName, setPemasokName] = useState('Pemasok ABC');
  const [error, setError] = useState(null);
  const { id } = useParams(); // Destructure id from useParams

  useEffect(() => {
    const fetchDetailPembelian = async () => {
      try {
        // Fetch purchase details
        const data = await API_Source.getDetailPembelian(id);
        setPembelianDetails(data);

        // Fetch all spare parts and suppliers
        const spareparts = await API_Source.getSparepart();
        const pemasoks = await API_Source.getPemasok();

        // Find the corresponding spare part name
        const sparepart = spareparts.find((sp) => sp.id_sparepart === data.id_sparepart);
        setSparepartName(sparepart ? sparepart.nama_sparepart : 'Unknown Sparepart');

        // Find the corresponding supplier name
        const pemasok = pemasoks.find((pm) => pm.id_pemasok === data.id_pemasok);
        setPemasokName(pemasok ? pemasok.nama_pemasok : 'Unknown Pemasok');
      } catch (err) {
        setError(err);
      }
    };

    if (id) {
      // Ensure id is available before fetching
      fetchDetailPembelian();
    }
  }, [id]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error.message}
      </div>
    ); // Display error message
  }

  if (!pembelianDetails) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Dummy breadcrumb links
  const breadcrumbLinks = [
    { label: 'Home', path: '/kategori' },
    { label: 'Pembelian', path: '/pembelian' },
    { label: 'Detail Pembelian', path: `/pembelian/${id}` },
  ];

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Breadcrumb links={breadcrumbLinks} userId={id} />
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">Detail Pembelian</h1>
      <div className="bg-white shadow-lg rounded-lg p-4">
        <ul className="space-y-4">
          <li className="flex items-center">
            <FaTag className="mr-2" />
            <strong>ID Pembelian:</strong> <span className="ml-4">{pembelianDetails.id_pembelian}</span>
          </li>
          <li className="flex items-center">
            <FaTag className="mr-2" />
            <strong>Nama Sparepart:</strong> <span className="ml-4">{sparepartName}</span>
          </li>
          <li className="flex items-center">
            <FaUser  className="mr-2" />
            <strong>Nama Pemasok:</strong> <span className="ml-4">{pemasokName}</span>
          </li>
          <li className="flex items-center">
            <FaCalendarAlt className="mr-2" />
            <strong>Tanggal:</strong> <span className="ml-4">{format(new Date(pembelianDetails.tanggal), 'dd/MM/yyyy')}</span>
          </li>
          <li className="flex items-center">
            <FaMoneyBillWave className="mr-2" />
            <strong>Jumlah:</strong> <span className="ml-4">{pembelianDetails.jumlah}</span>
          </li>
          <li className="flex items-center">
            <FaMoneyBillWave className="mr-2" />
            <strong>Total Harga:</strong> <span className="ml-4">{pembelianDetails.total_harga}</span>
          </li>
          <li className="flex items-center">
            <strong>Status:</strong>
            <StatusIcon status={pembelianDetails.status} /> {/* Menampilkan ikon status */}
          </li>
          <li className="flex items-center">
            <FaCalendarAlt className="mr-2" />
            <strong>Created At:</strong> <span className="ml-4">{format(new Date(pembelianDetails.created_at), 'dd/MM/yyyy')}</span>
          </li>
          <li className="flex items-center">
            <FaCalendarAlt className="mr-2" />
            <strong>Updated At:</strong> <span className="ml-4">{format(new Date(pembelianDetails.updated_at), 'dd/MM/yyyy')}</span>
          </li>
        </ul>
      </div>
    </motion.div>
  );
}; 