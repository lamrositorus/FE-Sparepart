import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaHome,
  FaCar,
  FaMoneyBillWaveAlt,
  FaUser ,
  FaSignOutAlt,
} from 'react-icons/fa';
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
            <li><Link to="/kategori" className="flex items-center py-2 text-gray-400 hover:text-secondary"><FaHome className="mr-2" /> Kategori</Link></li>
            <li><Link to="/sparepart" className="flex items-center py-2 text-gray-400 hover:text-secondary"><FaCar className="mr-2" /> Sparepart</Link></li>
            <li><Link to="/pemasok" className="flex items-center py-2 text-gray-400 hover:text-secondary"><FaUser  className="mr-2" /> Pemasok</Link></li>
            <li><Link to="/customer" className="flex items-center py-2 text-gray-400 hover:text-secondary"><FaUser  className="mr-2" /> Customer</Link></li>
            <li><Link to="/pembelian" className="flex items-center py-2 text-gray-400 hover:text-secondary"><FaMoneyBillWaveAlt className="mr-2" /> Pembelian</Link></li>
            <li><Link to="/penjualan" className="flex items-center py-2 text-gray-400 hover:text-secondary"><FaMoneyBillWaveAlt className="mr-2" /> Penjualan</Link></li>            
            <li><Link to={`/user/${id}`} className="flex items-center py-2 text-gray-400 hover:text-secondary"><FaUser  className="mr-2" /> Pengguna</Link></li>
            <li><button onClick={handleLogout} className="btn btn-error btn-sm flex items-center"><FaSignOutAlt className="mr-2" /> Logout</button></li>
          </>
        ) : (
          <li><Link to="/user/login" className="btn btn-primary btn-sm">Login</Link></li>
        )}
      </>
    );
  };

  return (
    <header className="bg-base-200 text-neutral p-4 shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-400">Sparepart Mobil</h1>
        <label className="btn btn-circle swap swap-rotate md:hidden">
          <input type="checkbox" onChange={toggleMenu} checked={isOpen} />

          {/* hamburger icon */}
          <svg
            className="swap-off fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512">
            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
          </svg>

          {/* close icon */}
          <svg
            className="swap-on fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512">
            <polygon
              points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
          </svg>
        </label>
      </div>
      <nav className="hidden md:flex">
        <ul className="menu menu-horizontal p-0 gap-4">{renderMenuTabs()}</ul>
      </nav>
      <motion.nav
        initial={{ opacity: 0, height: 0 }}
        animate={isOpen ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
        className="md:hidden bg-base-200 rounded-lg shadow-lg mt-2"
      >
        <ul className="menu menu-vertical p-4 gap-2">{renderMenuTabs()}</ul>
      </motion.nav>
    </header>
  );
};

export default Header;