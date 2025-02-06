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
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { formatMonth } from '../components/Rupiah'; // Import formatMonth

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
        console.log('Data Pengguna:', data);
        setPengguna(data);
      } catch (err) {
        setError(err.message || 'Terjadi kesalahan saat memuat profil.');        
        toast.error(err.message);
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
          console.log('Statistics Response:', response); // Log the response
          setStatistics(response); // Set the statistics directly from the response
        } catch (error) {
          setStatsError(error.message || 'Terjadi kesalahan saat memuat statistik.');
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
      <Alert severity="error">{error}</Alert>
    );
  }

// Data untuk grafik batang
let statisticsChartData = {
  labels: [], // Initialize labels as an empty array
  datasets: [
    {
      label: 'Jumlah Transaksi',
      data: [], // Initialize with an empty array
      backgroundColor: 'rgba(75,192,192,0.4)',
      yAxisID: 'y1', // Use the first Y-axis for Jumlah Transaksi
    },
    {
      label: 'Total Penjualan',
      data: [], // Initialize with an empty array
      backgroundColor: 'rgba(153,102,255,0.4)',
      yAxisID: 'y2', // Use the second Y-axis for Total Penjualan
    },
    {
      label: 'Total Keuntungan',
      data: [], // Initialize with an empty array
      backgroundColor: 'rgba(255,159,64,0.4)',
      yAxisID: 'y2', // Use the second Y-axis for Total Keuntungan
    },
  ],
};

// If tab Statistik is active, prepare chart data based on API statistics
if (tabValue === 1 && !statsLoading && !statsError && statistics.length > 0) {
  statistics.forEach(item => {
    const monthIndex = parseInt(item.bulan) - 1; // Convert month to zero-based index
    if (!statisticsChartData.labels[monthIndex]) {
      statisticsChartData.labels[monthIndex] = formatMonth(monthIndex + 1);
    }
    statisticsChartData.datasets[0].data[monthIndex] = parseInt(item.jumlah_transaksi);
    statisticsChartData.datasets[1].data[monthIndex] = parseFloat(item.total_penjualan);
    statisticsChartData.datasets[2].data[monthIndex] = parseFloat(item.total_keuntungan);
  });
}

// Options for the bar chart with secondary Y-axis
const chartOptions = {
  responsive: true,
  scales: {
    y1: {
      type: 'linear',
      position: 'left',
      title: {
        display: true,
        text: 'Jumlah Transaksi',
      },
      ticks: {
        beginAtZero: true,
      },
    },
    y2: {
      type: 'linear',
      position: 'right',
      title: {
        display: true,
        text: 'Total Penjualan & Keuntungan',
      },
      ticks: {
        beginAtZero: true,
      },
      grid: {
        drawOnChartArea: false, // Only want the grid lines for one axis to show up
      },
    },
  },
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Statistik Penjualan Per Bulan',
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
              <div className="w-24 h-24 rounded-full">
                <img
                  src={pengguna.profile_picture || 'https://via.placeholder.com/150'}
                  alt="User  Avatar"
                />
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
                <div className="h-full">
                  <h2 className="text-xl text-center font-semibold mb-4">Statistik Penjualan</h2>
                  {statsLoading ? (
                    <div className="min-h-screen flex items-center justify-center">
                      <span className="loading loading-infinity loading-lg"></span>
                    </div>
                  ) : statsError ? (
                    <div className="alert alert-error">{statsError}</div>
                  ) : (
                    <Bar data={statisticsChartData} options={chartOptions} />
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