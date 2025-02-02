// StatusIcon.js (if you want to create a separate file)
import React from 'react';
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

const StatusIcon = ({ status }) => {
  let icon;
  let color;

  switch (status) {
    case 'Selesai':
      icon = <FaCheckCircle />;
      color = 'text-green-500';
      break;
    case 'Pending':
      icon = <FaClock />;
      color = 'text-yellow-500';
      break;
    case 'Dibatalkan':
      icon = <FaTimesCircle />;
      color = 'text-red-500';
      break;
    default:
      icon = null;
      color = '';
  }

  return (
    <div className={`flex items-center ${color}`}>
      {icon}
      <span className="ml-2">{status}</span>
    </div>
  );
};

export default StatusIcon;
