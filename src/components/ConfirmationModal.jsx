// src/components/ConfirmationModal.js
import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open" role="dialog" aria-labelledby="confirmation-title" aria-describedby="confirmation-message">
      <div className="modal-box">
        <h2 className="font-bold text-lg" id="confirmation-title">Konfirmasi</h2>
        <p className="py-4" id="confirmation-message">{message}</p>
        <div className="modal-action">
          <button className="btn" onClick={onClose} aria-label="Batal">
            Batal
          </button>
          <button className="btn btn-error" onClick={onConfirm} aria-label="Ya, Lanjutkan">
            Ya, Lanjutkan
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default ConfirmationModal;