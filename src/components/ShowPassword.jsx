// ShowPassword.js
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ShowPassword = ({ label, value, onChange, required }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="form-control mb-4">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <div className="relative">
        <motion.input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          required={required}
          className="input input-bordered w-full"
          placeholder={label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <button
          type="button"
          onClick={handleClickShowPassword}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          {showPassword ? (
            <FaEyeSlash className="text-gray-500" />
          ) : (
            <FaEye className="text-gray-500" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ShowPassword;
