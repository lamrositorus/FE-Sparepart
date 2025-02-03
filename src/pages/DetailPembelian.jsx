import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatPrice } from '../components/Rupiah';
import { API_Source } from '../global/Apisource';
import { FaTag, FaUser, FaCalendarAlt, FaMoneyBillWave, FaInfoCircle } from 'react-icons/fa';
import { format } from 'date-fns';
import Breadcrumb from '../components/BreadCumb'; // Importing Breadcrumb component
import StatusIcon from '../components/StatusIcon'; // Import the StatusIcon component

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
      <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>
    ); // Display error message
  }

  if (!pembelianDetails) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Dummy breadcrumb links
  const breadcrumbLinks = [
    { label: 'Home', path: '/kategori' },
    { label: 'Pembelian', path: '/pembelian' },
  ];

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Breadcrumb links={breadcrumbLinks} />
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">Detail Pembelian</h1>
      <div className="card bg-base-100 shadow-xl p-6">
        <div className="flex flex-col gap-5 md:flex-row">
          <div className="md:w-1/3 mb-4 md:mb-0">
            <img
              src={`https://picsum.photos/400/300`} // Use random image
              alt={sparepartName}
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="md:w-1/2">
            <ul className="space-y-4">
              <li className="flex items-center">
                <FaTag className="mr-2 text-blue-500" />
                <strong>ID Pembelian:</strong>
                <span className="ml-4">{pembelianDetails.id_pembelian}</span>
              </li>
              <li className="flex items-center">
                <FaTag className="mr-2 text-blue-500" />
                <strong>Nama Sparepart:</strong>
                <span className="ml-4">{sparepartName}</span>
              </li>
              <li className="flex items-center">
                <FaUser className="mr-2 text-blue-500" />
                <strong>Nama Pemasok:</strong>
                <span className="ml-4">{pemasokName}</span>
              </li>
              <li className="flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                <strong>Tanggal:</strong>
                <span className="ml-4">
                  {format(new Date(pembelianDetails.tanggal), 'dd/MM/yyyy')}
                </span>
              </li>
              <li className="flex items-center">
                <FaMoneyBillWave className="mr-2 text-blue-500" />
                <strong>Jumlah:</strong>
                <span className="ml-4">{pembelianDetails.jumlah}</span>
              </li>
              <li className="flex items-center">
                <FaMoneyBillWave className="mr-2 text-blue-500" />
                <strong>Total Harga:</strong>
                <span className="ml-4">{formatPrice(pembelianDetails.total_harga)}</span>
              </li>
              <li className="flex items-center">
                <FaInfoCircle className="mr-2 text-blue-500" />
                <strong>Status:</strong>
                <span className="ml-4">
                  <StatusIcon status={pembelianDetails.status} /> {/* Display status icon */}
                </span>
              </li>
              <li className="flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                <strong>Created At:</strong>
                <span className="ml-4">
                  {format(new Date(pembelianDetails.created_at), 'dd/MM/yyyy')}
                </span>
              </li>
              <li className="flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                <strong>Updated At:</strong>
                <span className="ml-4">
                  {format(new Date(pembelianDetails.updated_at), 'dd/MM/yyyy')}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DetailPembelian;
