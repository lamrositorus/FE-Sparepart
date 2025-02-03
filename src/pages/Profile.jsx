import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { useAuth } from '../context/AuthContext';
import {

  Box,

  CircularProgress,
  Alert,

} from '@mui/material';
import { motion } from 'framer-motion';
import { FaEdit, FaChartLine, FaImages, FaUserCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Import dan register modul Chart.js yang diperlukan
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatMonth } from '../components/Rupiah'; // Import formatMonth

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);



export const Profil = () => {
  const { id } = useAuth();
  const [pengguna, setPengguna] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  // State untuk data statistik
  const [statistics, setStatistics] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    const fetchPengguna = async () => {
      try {
        const data = await API_Source.getUserProfil(id);
        setPengguna(data);
      } catch (err) {
        setError(err.message || 'Terjadi kesalahan saat memuat profil.');        
        toast.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPengguna();
  }, [id]);

  // Ambil data statistik saat tab "Statistik" aktif (tabValue === 1)
  useEffect(() => {
    if (tabValue === 1) {
      const fetchStatistics = async () => {
        setStatsLoading(true);
        try {
          const response = await API_Source.getStatistics();
          const statsData = response; // Ambil data dari payload
          setStatistics(statsData);
        } catch (error) {
          setStatsError(error);
        } finally {
          setStatsLoading(false);
        }
      };
      fetchStatistics();
    }
  }, [tabValue]);



  const handleEditDialogOpen = () => {
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Data untuk grafik default (jika diperlukan)
  const defaultChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Aktivitas',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: '#3f51b5',
        fill: false,
      },
    ],
  };

  // Jika tab Statistik aktif, persiapkan data grafik berdasarkan statistik API
  let statisticsChartData = defaultChartData;
  if (tabValue === 1 && !statsLoading && !statsError && statistics.length > 0) {
    const sortedStats = [...statistics].sort((a, b) => parseInt(a.bulan) - parseInt(b.bulan));
    const labels = sortedStats.map((item) => {
      const monthIndex = parseInt(item.bulan) - 1; // Konversi bulan ke index
      return formatMonth(monthIndex + 1); // Menggunakan formatMonth untuk mendapatkan nama bulan
    });
    const totalPenjualanData = sortedStats.map((item) => parseFloat(item.total_penjualan));
    const totalKeuntunganData = sortedStats.map((item) => parseFloat(item.total_keuntungan));
    const jumlahTransaksiData = sortedStats.map((item) => parseInt(item.jumlah_transaksi));

    statisticsChartData = {
      labels,
      datasets: [
        {
          label: 'Total Penjualan',
          data: totalPenjualanData,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
          fill: false,
          yAxisID: 'y-axis-1',
        },
        {
          label: 'Total Keuntungan',
          data: totalKeuntunganData,
          borderColor: 'rgba(153,102,255,1)',
          backgroundColor: 'rgba(153,102,255,0.2)',
          fill: false,
          yAxisID: 'y-axis-1',
        },
        {
          label: 'Jumlah Transaksi',
          data: jumlahTransaksiData,
          borderColor: 'rgba(255,159,64,1)',
          backgroundColor: 'rgba(255,159,64,0.2)',
          fill: false,
          yAxisID: 'y-axis-2',
        },
      ],
    };
  }

  // Opsi untuk grafik, dengan dua y-axis
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw.toLocaleString()}`; // Format angka
          },
        },
      },
      title: {
        display: true,
        text: 'Statistik Penjualan Per Bulan',
      },
    },
    scales: {
      'y-axis-1': {
        type: 'linear',
        position: 'left',
        ticks: {
          callback: function (value) {
            return value.toLocaleString(); // Format angka
          },
        },
      },
      'y-axis-2': {
        type: 'linear',
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function (value) {
            return value.toLocaleString(); // Format angka
          },
        },
      },
    },
  };



  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Profile Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="avatar">
                <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={pengguna.profile_picture} alt="Profil" />
                  {!pengguna.profile_picture && <FaUserCircle className="w-full h-full" />}
                </div>
              </div>

              {/* Nama Pengguna */}
              <h1 className="text-3xl font-bold mt-4">{pengguna.username}</h1>

              {/* Tombol Edit */}
              <button 
                className="btn btn-primary mt-4"
                onClick={handleEditDialogOpen}
              >
                <FaEdit className="mr-2" /> Edit Profil
              </button>

              {/* Tabs */}
              <div className="tabs tabs-boxed bg-base-200 mt-6">
                <button 
                  className={`tab ${tabValue === 0 ? 'tab-active' : ''}`}
                  onClick={() => setTabValue(0)}
                >
                  <FaUserCircle className="mr-2" /> Informasi
                </button>
                <button
                  className={`tab ${tabValue === 1 ? 'tab-active' : ''}`}
                  onClick={() => setTabValue(1)}
                >
                  <FaChartLine className="mr-2" /> Statistik
                </button>
                <button
                  className={`tab ${tabValue === 2 ? 'tab-active' : ''}`}
                  onClick={() => setTabValue(2)}
                >
                  <FaImages className="mr-2" /> Galeri
                </button>
              </div>

              {/* Konten Tab */}
              <div className="w-full mt-6">
                {/* Tab Informasi */}
                {tabValue === 0 && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="stats shadow">
                      <div className="stat">
                        <div className="stat-title">Email</div>
                        <div className="stat-value text-lg">{pengguna.email}</div>
                      </div>
                    </div>
                    <div className="stats shadow">
                      <div className="stat">
                        <div className="stat-title">Role</div>
                        <div className="stat-value text-lg">{pengguna.role}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab Statistik */}
                {tabValue === 1 && (
                  <div className="h-96">
                    <h2 className="text-xl font-semibold mb-4">Statistik Penjualan</h2>
                    {statsLoading ? (
                      <div className="flex justify-center items-center h-64">
                        <span className="loading loading-spinner loading-lg"></span>
                      </div>
                    ) : statsError ? (
                      <div className="alert alert-error">{statsError}</div>
                    ) : (
                      <Line data={statisticsChartData} options={chartOptions} />
                    )}
                  </div>
                )}

                {/* Tab Galeri */}
                {tabValue === 2 && (
                  <div className="carousel rounded-box">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <div key={item} className="carousel-item w-full">
                        <img
                          src={`https://plus.unsplash.com/premium_photo-1677009835565-1f6eb4cf4f63?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
                          className="w-full"
                          alt={`Galeri ${item}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal Edit */}
      <dialog className="modal" open={openEditDialog}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit Profil</h3>
          <p className="py-4">Fitur edit profil akan segera hadir!</p>
          <div className="modal-action">
            <button className="btn" onClick={handleEditDialogClose}>
              Tutup
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );

};
