// src/components/ConfirmationModal.js
import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h2 className="font-bold text-lg">Konfirmasi</h2>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>Batal</button>
          <button className="btn btn-error" onClick={onConfirm}>Ya, Lanjutkan</button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default ConfirmationModal;