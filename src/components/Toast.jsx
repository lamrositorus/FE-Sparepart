// Toast.js
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000); // Toast will disappear after 1 second

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [onClose]);

  const variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div
      className={`toast toast-top toast-end mb-4`}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.5 }}
    >
      <div className={`alert ${type === 'success' ? 'alert-success' : 'alert-error'}`}>
        <div>
          <span>{message}</span>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Toast;
