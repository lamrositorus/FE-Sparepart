import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ links, userId }) => {
  return (
    <nav className="mb-4">
      {links.map((link, index) => (
        <span key={index}>
          <Link to={link.path} className="text-blue-600">
            {link.label}
          </Link>
          {index < links.length - 1 && <span className="mx-1">&gt;</span>}
        </span>
      ))}
      {userId && (
        <>
          <span className="mx-1">&gt;</span>
          <span className="text-gray-500">User ID: {userId}</span>
        </>
      )}
    </nav>
  );
};

export default Breadcrumb;
