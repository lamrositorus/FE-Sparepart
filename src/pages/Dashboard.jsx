import React, { useEffect, useState } from 'react';
import { API_Source } from "../global/Apisource";
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { formatPrice } from '../components/Rupiah';
import format from 'date-fns/format';

Chart.register(...registerables);

export const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedPeriod, setSelectedPeriod] = useState('monthly');

    useEffect(() => {
        let isMounted = true;
        setError(null);
        setLoading(true);

        const fetchData = async () => {
            try {
                const [dashboardRes, activitiesRes] = await Promise.all([
                    API_Source.getDashboard(selectedYear, selectedPeriod),
                    API_Source.getActivities()
                                        
                ]);
                
                if (isMounted) {
                    setDashboardData(dashboardRes);
                    setRecentActivities(activitiesRes);
                }
            } catch (err) {
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [selectedYear, selectedPeriod]);

    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = currentYear; year >= 2020; year--) {
            years.push(
                <option key={year} value={year}>
                    Tahun {year}
                </option>
            );
        }
        return years;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <span className="loading loading-infinity loading-lg text-primary"></span>
                    <p className="mt-4 text-lg font-medium">Memuat Dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error shadow-lg max-w-2xl mx-auto mt-8">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Error! Gagal memuat data: {error}</span>
                </div>
            </div>
        );
    }

    if (!dashboardData) return null;

    // Chart configuration
    const getChartData = () => {
        let labels = [];
        let data = [];
        
        switch (selectedPeriod) {
            case 'monthly':
                if(Array.isArray(dashboardData.monthlySales)) {
                    labels = dashboardData.monthlySales.map(sale => sale.bulan);
                    data = dashboardData.monthlySales.map(sale => parseFloat(sale.total_penjualan));
                } else {
                    console.error("monthlySales is not an array or is undefined");
                }
                break;
            case 'weekly':
                if (Array.isArray(dashboardData.weeklySales)) {
                    labels = dashboardData.weeklySales.map(sale => `Minggu ${sale.minggu}`);
                    data = dashboardData.weeklySales.map(sale => parseFloat(sale.total_penjualan));
                } else {
                    console.error("weeklySales is not an array or is undefined");
                }
                break;
            case 'daily':
                if (Array.isArray(dashboardData.dailySales)) {
                    labels = dashboardData.dailySales.map(sale => 
                        format(new Date(sale.tanggal), 'dd MMM yyyy')
                    );
                    data = dashboardData.dailySales.map(sale => parseFloat(sale.total_penjualan));
                } else {
                    console.error("dailySales is not an array or is undefined");
                }
                break;
            default:
                break;
        }


        return {
            labels,
            datasets: [
                {
                    label: 'Total Penjualan',
                    data,
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.05)',
                    borderWidth: 2,
                    pointRadius: 3,
                    tension: 0.1,
                    fill: true
                },
            ],
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: (context) => ` Rp${context.parsed.y.toLocaleString()}`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => `Rp${value.toLocaleString()}`
                }
            }
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Dashboard Penjualan
                </h1>
                <div className="flex gap-2 flex-wrap justify-end">
                    <select 
                        className="select select-bordered w-full md:w-48"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                        {generateYearOptions()}
                    </select>
                    <div className="tabs tabs-boxed">
                        <button 
                            className={`tab ${selectedPeriod === 'monthly' ? 'tab-active' : ''}`}
                            onClick={() => setSelectedPeriod('monthly')}
                        >
                            Bulanan
                        </button>
                        <button 
                            className={`tab ${selectedPeriod === 'weekly' ? 'tab-active' : ''}`}
                            onClick={() => setSelectedPeriod('weekly')}
                        >
                            Mingguan
                        </button>
                        <button 
                            className={`tab ${selectedPeriod === 'daily' ? 'tab-active' : ''}`}
                            onClick={() => setSelectedPeriod('daily')}
                        >
                            Harian
                        </button>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { 
                        title: 'Total Penjualan', 
                        value: formatPrice(dashboardData.totalPenjualan), 
                        icon: '💰', 
                        trend: `${dashboardData.trend}`,
                        trendColor: 'text-success'
                    },
                    { 
                        title: 'Total Keuntungan', 
                        value: formatPrice(dashboardData.totalKeuntungan), 
                        icon: '📈', 
                        trend: `${dashboardData.trend}`,
                        trendColor: 'text-error'
                    },
                    { 
                        title: 'Total Pelanggan', 
                        value: dashboardData.totalPelanggan, 
                        icon: '👥', 
                        trend: `${dashboardData.trend}`,
                        trendColor: 'text-success'
                    },
                    { 
                        title: 'Total Sparepart', 
                        value: dashboardData.totalSparepart, 
                        icon: '🔧', 
                        trend: 'Stok tersedia',
                        trendColor: 'text-warning'
                    },
                ].map((metric, index) => (
                    <div key={index} className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
                        <div className="card-body p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">{metric.title}</h3>
                                    <p className="text-2xl font-bold mt-1">
                                        {typeof metric.value === 'number' 
                                            ? metric.title.includes('Rp') 
                                                ? formatPrice(metric.value)
                                                : metric.value.toLocaleString()
                                            : metric.value}
                                    </p>
                                </div>
                                <div className="avatar placeholder">
                                    <div className="bg-neutral-focus text-neutral-content rounded-full w-12 h-12">
                                        <span className="text-2xl">{metric.icon}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={`text-sm mt-2 flex items-center ${metric.trendColor}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {metric.trendColor === 'text-success' ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                    )}
                                </svg>
                                {metric.trend}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart Section */}
            <div className="card bg-base-100 shadow-md p-4 mb-8">
                <div className="h-96">
                    <Line data={getChartData()} options={chartOptions} />
                </div>
            </div>

            {/* Recent Activities */}
            <div className="card bg-base-100 shadow-md">
                <div className="card-body p-4">
                    <h2 className="card-title text-xl mb-4">Aktivitas Terakhir</h2>
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>Waktu</th>
                                    <th>Tipe Aktivitas</th>
                                    <th>Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentActivities.length > 0 ? (
                                    recentActivities.map((activity, index) => (
                                        <tr key={index}>
                                            <td>
                                                {format(
                                                    new Date(activity.waktu), 
                                                    'dd MMM yyyy HH:mm'
                                                )}
                                            </td>
                                            <td>
                                                <span className={`badge ${activity.jenis_aktivitas === 'penjualan' 
                                                    ? 'badge-primary' 
                                                    : 'badge-secondary'}`}>
                                                    {activity.jenis_aktivitas}
                                                </span>
                                            </td>
                                            <td className="max-w-xs truncate">{activity.detail}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center">
                                            Tidak ada aktivitas terbaru
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};