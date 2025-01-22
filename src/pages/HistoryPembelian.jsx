import React, { useEffect, useState } from "react";
import { API_Source } from "../global/Apisource"; // Pastikan path ini benar
import { Table, Spin, Alert } from 'antd'; // Mengimpor komponen dari Ant Design
import { FaExclamationTriangle } from 'react-icons/fa'; // Mengimpor ikon dari React Icons
import { formatPrice } from "../components/Rupiah"; // Mengimpor fungsi formatPrice

export const HistoryPembelian = () => {
    const [historyData, setHistoryData] = useState([]);
    const [pemasok, setPemasok] = useState([]); // State untuk menyimpan data pemasok
    const [spareparts, setSpareparts] = useState([]); // State untuk menyimpan data sparepart
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mengambil data history pembelian
    const fetchHistoryPembelian = async () => {
        try {
            const response = await API_Source.getHistoryPembelian();
            setHistoryData(response); // Mengatur data ke state
        } catch (error) {
            console.error('Error fetching history pembelian:', error);
            setError(error.message); // Menyimpan pesan error ke state
        }
    };

    // Mengambil data pemasok
    const fetchPemasok = async () => {
        try {
            const data = await API_Source.getPemasok();
            setPemasok(data); // Mengatur data pemasok ke state
        } catch (error) {
            console.error('Error fetching pemasok:', error);
            setError(error.message); // Menyimpan pesan error ke state
        }
    };

    // Mengambil data sparepart
    const fetchSpareparts = async () => {
        try {
            const data = await API_Source.getSparepart();
            setSpareparts(data); // Mengatur data sparepart ke state
        } catch (error) {
            console.error('Error fetching spareparts:', error);
            setError(error.message); // Menyimpan pesan error ke state
        }
    };

    // Mengambil data saat komponen dimuat
    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([fetchHistoryPembelian(), fetchPemasok(), fetchSpareparts()]);
            setLoading(false);
        };
        fetchData();
    }, []);

    // Menampilkan loading atau error jika ada
    if (loading) {
        return <Spin size="large" tip="Loading..." />; // Menampilkan spinner loading dari Ant Design
    }

    if (error) {
        return (
            <Alert
                message="Error"
                description={<span><FaExclamationTriangle /> {error}</span>}
                type="error"
                showIcon
            /> // Menampilkan pesan error dengan ikon
        );
    }

    // Buat mapping untuk pemasok dan sparepart
    const pemasokMap = {};
    pemasok.forEach(item => {
        pemasokMap[item.id_pemasok] = item.nama_pemasok; // Ganti dengan nama pemasok yang sesuai
    });

    const sparepartMap = {};
    spareparts.forEach(item => {
        sparepartMap[item.id_sparepart] = item.nama_sparepart; // Ganti dengan nama sparepart yang sesuai
    });

    // Hitung total pembelian
    const totalPembelian = historyData.reduce((total, item) => total + parseFloat(item.total_harga), 0);

    // Definisikan kolom untuk tabel
    const columns = [
        {
            title: 'ID History Pembelian',
            dataIndex: 'id_history_pembelian',
            key: 'id_history_pembelian',
        },
        {
            title: 'ID Pembelian',
            dataIndex: 'id_pembelian',
            key: 'id_pembelian',
        },
        {
            title: 'Nama Pemasok', // Mengubah ID Pemasok menjadi Nama Pemasok
            dataIndex: 'id_pemasok',
            key: 'id_pemasok',
            render: (text) => pemasokMap[text] || 'Unknown Pemasok', // Menampilkan nama pemasok
        },
        {
            title: 'Nama Sparepart', // Mengubah ID Sparepart menjadi Nama Sparepart
            dataIndex: 'id_sparepart',
            key: 'id_sparepart',
            render: (text) => sparepartMap[text] || 'Unknown Sparepart', // Menampilkan nama sparepart
        },
        {
            title: 'Jumlah',
            dataIndex: 'jumlah',
            key: 'jumlah',
        },
        {
            title: 'Total Harga',
            dataIndex: 'total_harga',
            key: 'total_harga',
            render: (text) => formatPrice(text), // Format total harga
        },
        {
            title: 'Tanggal',
            dataIndex: 'tanggal',
            key: 'tanggal',
            render: (text) => new Date(text).toLocaleDateString(), // Format tanggal
        },
    ];

    return (
        <div>
            <h1>History Pembelian</h1>
            {historyData.length === 0 ? (
                <Alert
                    message="Tidak ada data"
                    description="Belum ada data history pembelian yang tersedia."
                    type="info"
                    showIcon
                />
            ) : (
                <>
                    <Table
                        dataSource={historyData} // Menggunakan data source
                        columns={columns}
                        rowKey="id_history_pembelian" // Menggunakan ID sebagai kunci baris
                        pagination={{ pageSize: 10 }} // Mengatur pagination
                        scroll={{ x: 'max-content' }} // Menambahkan scroll horizontal
                    />
                    <div style={{ marginTop: 16, fontWeight: 'bold' }}>
                        Total Pembelian: {formatPrice(totalPembelian)} {/* Menampilkan total pembelian dengan format harga */}
                    </div>
                </>
            )}
        </div>
    );
};