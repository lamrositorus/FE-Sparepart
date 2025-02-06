import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/DarkMode'; // Import useTheme
import { FaHome, FaCar, FaMoneyBillWaveAlt, FaUser , FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { token, clearAuthData } = useAuth();
  const navigate = useNavigate();
  const { toggleTheme, theme } = useTheme(); // Use theme context

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
        {token ? (
          <>
            <li>
              <Link
                to="/dashboard"
                className="flex items-center py-2 text-gray-600 hover:text-gray-500"
              >
                <FaHome className="mr-2" /> Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/kategori"
                className="flex items-center py-2 text-gray-600 hover:text-gray-500"
              >
                <FaHome className="mr-2" /> Kategori
              </Link>
            </li>
            <li>
              <Link
                to="/sparepart"
                className="flex items-center py-2 text-gray-600 hover:text-gray-500"
              >
                <FaCar className="mr-2" /> Sparepart
              </Link>
            </li>
            <li>
              <Link
                to="/pemasok"
                className="flex items-center py-2 text-gray-600 hover:text-gray-500"
              >
                <FaUser  className="mr-2" /> Pemasok
              </Link>
            </li>
            <li>
              <Link
                to="/customer"
                className="flex items-center py-2 text-gray-600 hover:text-gray-500"
              >
                <FaUser  className="mr-2" /> Customer
              </Link>
            </li>
            <li>
              <Link
                to="/pembelian"
                className="flex items-center py-2 text-gray-600 hover:text-gray-500"
              >
                <FaMoneyBillWaveAlt className="mr-2" /> Pembelian
              </Link>
            </li>
            <li>
              <Link
                to="/penjualan"
                className="flex items-center py-2 text-gray-600 hover:text-gray-500"
              >
                <FaMoneyBillWaveAlt className="mr-2" /> Penjualan
              </Link>
            </li>
            <li>
              <Link
                to={`/user/${token}`}
                className="flex items-center py-2 text-gray-600 hover:text-gray-500"
              >
                <FaUser  className="mr-2" /> Pengguna
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="flex items-center py-2 text-red-500 hover:text-red-700">
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/user/login" className="btn btn-primary btn-sm">
              Login
            </Link>
          </li>
        )}
      </>
    );
  };

  return (
    <header className="bg-base-200 text-neutral p-4 shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-500">Sparepart Mobil</h1>
        <label className="swap swap-rotate">
          <input type="checkbox" onChange={toggleTheme} checked={theme === 'dark'} />

          {/* Moon icon */}
          <svg
            className="swap-off h-10 w-10 fill-current text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="32"
            height="32"
          >
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
          {/* Sun icon */}
          <svg
            className="swap-on h-10 w-10 fill-current text-yellow-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="32"
            height="32"
          >
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>
        </label>
        <label className="btn btn-circle swap swap-rotate md:hidden">
          <input type="checkbox" onChange={toggleMenu} checked={isOpen} />

          {/* Hamburger icon */}
          <svg
            className="swap-off fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
          </svg>

          {/* Close icon */}
          <svg
            className="swap-on fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
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