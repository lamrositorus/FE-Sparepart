import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Typography,
  Box,
  Avatar,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { motion } from 'framer-motion';
import { FaEdit, FaChartLine, FaImages, FaUserCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from 'styled-components';

// Import dan register modul Chart.js yang diperlukan
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatMonth } from '../components/Rupiah'; // Import formatMonth

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Styled Components
const ProfileCard = styled(Paper)`
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  background: #1f2937; /* Dark background */
`;

const ProfileAvatar = styled(Avatar)`
  width: 150px;
  height: 150px;
  margin-bottom: 1rem;
  border: 4px solid #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const CarouselContainer = styled(Box)`
  margin-top: 2rem;
  padding: 1rem;
  background: #374151; /* Darker background */
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

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
        toast.error('Gagal memuat profil!');
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
        fill: false
      }
    ]
  };

  // Jika tab Statistik aktif, persiapkan data grafik berdasarkan statistik API
  let statisticsChartData = defaultChartData;
  if (tabValue === 1 && !statsLoading && !statsError && statistics.length > 0) {
    const sortedStats = [...statistics].sort((a, b) => parseInt(a.bulan) - parseInt(b.bulan));
    const labels = sortedStats.map(item => {
      const monthIndex = parseInt(item.bulan) - 1; // Konversi bulan ke index
      return formatMonth(monthIndex + 1); // Menggunakan formatMonth untuk mendapatkan nama bulan
    });
    const totalPenjualanData = sortedStats.map(item => parseFloat(item.total_penjualan));
    const totalKeuntunganData = sortedStats.map(item => parseFloat(item.total_keuntungan));
    const jumlahTransaksiData = sortedStats.map(item => parseInt(item.jumlah_transaksi));

    statisticsChartData = {
      labels,
      datasets: [
        {
          label: 'Total Penjualan',
          data: totalPenjualanData,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
          fill: false,
          yAxisID: 'y-axis-1'
        },
        {
          label: 'Total Keuntungan',
          data: totalKeuntunganData,
          borderColor: 'rgba(153,102,255,1)',
          backgroundColor: 'rgba(153,102,255,0.2)',
          fill: false,
          yAxisID: 'y-axis-1'
        },
        {
          label: 'Jumlah Transaksi',
          data: jumlahTransaksiData,
          borderColor: 'rgba(255,159,64,1)',
          backgroundColor: 'rgba(255,159,64,0.2)',
          fill: false,
          yAxisID: 'y-axis-2'
        }
      ]
    };
  }

  // Opsi untuk grafik, dengan dua y-axis
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw.toLocaleString()}`; // Format angka
          }
        }
      },
      title: {
        display: true,
        text: 'Statistik Penjualan Per Bulan'
      }
    },
    scales: {
      'y-axis-1': {
        type: 'linear',
        position: 'left',
        ticks: {
          callback: function (value) {
            return value.toLocaleString(); // Format angka
          }
        }
      },
      'y-axis-2': {
        type: 'linear',
        position: 'right',
        grid: {
          drawOnChartArea: false
        },
        ticks: {
          callback: function (value) {
            return value.toLocaleString(); // Format angka
          }
        }
      }
    }
  };

  // Settings untuk carousel
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Menampilkan satu gambar pada perangkat mobile
    slidesToScroll: 1
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ProfileCard className="bg-gray-800 text-white">
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
            <ProfileAvatar src={pengguna.profile_picture} alt="Profil">
              {!pengguna.profile_picture && <FaUserCircle size={80} />}
            </ProfileAvatar>

            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              {pengguna.username}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              startIcon={<FaEdit />}
              onClick={handleEditDialogOpen}
              sx={{ mb: 3 }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Edit Profil
            </Button>

            <Tabs value={tabValue} onChange={handleTabChange} centered className="bg-gray-700">
              <Tab label="Informasi" icon={<FaUserCircle />} />
              <Tab label="Statistik" icon={<FaChartLine />} />
              <Tab label="Galeri" icon={<FaImages />} />
            </Tabs>

            <Box sx={{ mt: 3, width: '100%' }}>
              {tabValue === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <div className="stat">
                      <div className="stat-title">Email</div>
                      <div className="stat-value">{pengguna.email}</div>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div className="stat">
                      <div className="stat-title">Role</div>
                      <div className="stat-value">{pengguna.role}</div>
                    </div>
                  </Grid>
                </Grid>
              )}

              {tabValue === 1 && (
                <Box sx={{ height: '400px' }}> {/* Menentukan tinggi untuk grafik */}
                  <Typography variant="h6" gutterBottom>
                    Statistik Penjualan
                  </Typography>
                  {statsLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                      <CircularProgress />
                    </Box>
                  ) : statsError ? (
                    <Alert severity="error">{statsError}</Alert>
                  ) : (
                    <Line data={statisticsChartData} options={chartOptions} key="chart-statistics" />
                  )}
                </Box>
              )}

              {tabValue === 2 && (
                <div className="carousel carousel-center bg-neutral rounded-box max-w-md space-x-4 p-4">
                <div className="carousel-item">
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp"
                    className="rounded-box" />
                </div>
                <div className="carousel-item">
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp"
                    className="rounded-box" />
                </div>
                <div className="carousel-item">
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp"
                    className="rounded-box" />
                </div>
                <div className="carousel-item">
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp"
                    className="rounded-box" />
                </div>
                <div className="carousel-item">
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp"
                    className="rounded-box" />
                </div>
                <div className="carousel-item">
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1559181567-c3190ca9959b.webp"
                    className="rounded-box" />
                </div>
                <div className="carousel-item">
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1601004890684-d8cbf643f5f2.webp"
                    className="rounded-box" />
                </div>
              </div>
              )}
            </Box>
          </Box>
        </ProfileCard>
      </motion.div>

      <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Profil</DialogTitle>
        <DialogContent>
          <Typography>Fitur edit profil akan segera hadir!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="primary">
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};