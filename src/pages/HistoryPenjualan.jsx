import React, { useEffect, useState } from "react";
import { API_Source } from "../global/Apisource"; // Pastikan path ini benar
import { Table, Spin, Alert } from 'antd'; // Mengimpor komponen dari Ant Design
import { FaExclamationTriangle } from 'react-icons/fa'; // Mengimpor ikon dari React Icons
import { formatPrice } from "../components/Rupiah"; // Mengimpor fungsi formatPrice

export const HistoryPenjualan = () => {
    const [historyData, setHistoryData] = useState([]);
    const [customers, setCustomers] = useState([]); // State untuk menyimpan data customer
    const [spareparts, setSpareparts] = useState([]); // State untuk menyimpan data sparepart
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mengambil data history penjualan
    const fetchHistoryPenjualan = async () => {
        try {
            const data = await API_Source.getHistoryPenjualan();
            setHistoryData(data); // Mengatur data ke state
        } catch (error) {
            console.error('Error fetching history penjualan:', error);
            setError(error.message); // Menyimpan pesan error ke state
        }
    };

    // Mengambil data customer
    const fetchCustomers = async () => {
        try {
            const data = await API_Source.getCustomer();
            setCustomers(data); // Mengatur data customer ke state
        } catch (error) {
            console.error('Error fetching customers:', error);
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
            await Promise.all([fetchHistoryPenjualan(), fetchCustomers(), fetchSpareparts()]);
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
            />
        ); // Menampilkan pesan error dengan ikon
    }

    // Hitung total keuntungan
    const totalKeuntungan = historyData.reduce((total, item) => total + parseFloat(item.keuntungan), 0);

    // Buat mapping untuk customer dan sparepart
    const customerMap = {};
    customers.forEach(customer => {
        customerMap[customer.id_customer] = customer.nama_customer;
    });

    const sparepartMap = {};
    spareparts.forEach(sparepart => {
        sparepartMap[sparepart.id_sparepart] = sparepart.nama_sparepart;
    });

    // Definisikan kolom untuk tabel
    const columns = [
        {
            title: 'ID History Penjualan',
            dataIndex: 'id_history_penjualan',
            key: 'id_history_penjualan',
        },
        {
            title: 'ID Penjualan',
            dataIndex: 'id_penjualan',
            key: 'id_penjualan',
        },
        {
            title: 'Nama Customer', // Mengubah ID Customer menjadi Nama Customer
            dataIndex: 'id_customer',
            key: 'id_customer',
            render: (text) => customerMap[text] || 'Unknown Customer', // Menampilkan nama customer
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
            title: 'Harga Beli',
            dataIndex: 'harga_beli',
            key: 'harga_beli',
            render: (text) => formatPrice(text), // Format harga beli
        },
 {
            title: 'Harga Jual',
            dataIndex: 'harga_jual',
            key: 'harga_jual',
            render: (text) => formatPrice(text), // Format harga jual
        },
        {
            title: 'Margin (%)', // Mengubah kolom Margin menjadi Margin (%)
            dataIndex: 'margin',
            key: 'margin',
            render: (text, record) => {
                const hargaJual = parseFloat(record.harga_jual);
                const hargaBeli = parseFloat(record.harga_beli);
                if (hargaJual > 0) {
                    const margin = ((hargaJual - hargaBeli) / hargaJual) * 100; // Hitung margin persentase
                    return `${margin.toFixed(2)}%`; // Tampilkan margin dengan 2 desimal
                }
                return '0%'; // Jika harga jual 0, kembalikan 0%
            },
        },
        {
            title: 'Keuntungan',
            dataIndex: 'keuntungan',
            key: 'keuntungan',
            render: (text) => formatPrice(text), // Format keuntungan
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
            <h1>History Penjualan</h1>
            <Table
                dataSource={historyData} // Menggunakan data source
                columns={columns}
                rowKey="id_history_penjualan" // Menggunakan ID sebagai kunci baris
                pagination={{ pageSize: 10 }} // Mengatur pagination
                scroll={{ x: 'max-content' }} // Menambahkan scroll horizontal
            />
            <div style={{ marginTop: 16, fontWeight: 'bold' }}>
                Total Keuntungan: {formatPrice(totalKeuntungan)} {/* Menampilkan total keuntungan dengan format harga */}
            </div>
        </div>
    );
};