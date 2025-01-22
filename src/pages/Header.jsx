import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaHome, FaCar, FaMoneyBillWaveAlt, FaUser, FaUserPlus , FaHistory, FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { id, clearAuthData } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    clearAuthData();
    setIsOpen(false);
    navigate('/user/login');
  };

  const renderMenuTabs = () => {
    return (
      <>
        {id ? (
          <>
            <li><Link to="/kategori" className="flex items-center py-2 hover:text-blue-500 rounded transition"><FaHome className="inline mr-2" /> Kategori</Link></li>
            <li><Link to="/sparepart" className="flex items-center py-2 hover:text-blue-500 rounded transition"><FaCar className="inline mr-2" /> Sparepart</Link></li>
            <li><Link to="/pemasok" className="flex items-center py-2 hover:text-blue-500 rounded transition"><FaUser  className="inline mr-2" /> Pemasok</Link></li>
            <li><Link to="/customer" className="flex items-center py-2 hover:text-blue-500 rounded transition"><FaUser  className="inline mr-2" /> Customer</Link></li>
            <li><Link to="/pembelian" className="flex items-center py-2 hover:text-blue-500 rounded transition"><FaMoneyBillWaveAlt className="inline mr-2" /> Pembelian</Link></li>
            <li><Link to="/penjualan" className="flex items-center py-2 hover:text-blue-500 rounded transition"><FaMoneyBillWaveAlt className="inline mr-2" /> Penjualan</Link></li>
            <li><Link to="/historypenjualan" className="flex items-center py-2 hover:text-blue-500 rounded transition"><FaHistory className="inline mr-2" /> Riwayat Penjualan</Link></li>
            <li><Link to="/historypembelian" className="flex items-center py-2 hover:text-blue-500 rounded transition"><FaHistory className="inline mr-2" /> Riwayat Pembelian</Link></li>
            <li>
              <button onClick={handleLogout} className="block py-2 hover:text-red-500  rounded transition"><FaSignOutAlt className='inline w-full mr-2'> Logout</FaSignOutAlt></button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/user/login" className="block py-2 hover:text-blue-500 rounded transition">Login</Link>
          </li>
        )}
      </>
    );
  };

  return (
    <header className="bg-[#F7F7F7] text-[#001F3F] p-4 shadow-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">My Amazing Website</h1>
        <button onClick={toggleMenu} aria-label="Toggle menu" className="text-[#001F3F] md:hidden">
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
      <nav className="hidden md:flex">
        <ul className="flex space-x-4">
          {renderMenuTabs()}
        </ul>
      </nav>
      <motion.nav
        initial={{ opacity: 0, height: 0 }}
        animate={isOpen ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
        className="md:hidden bg-[#F7F7F7] rounded-lg shadow-lg"
      >
        <ul className="flex flex-col p-4">
          {renderMenuTabs()}
        </ul>
      </motion.nav>
    </header>
  );
};

export default Header;