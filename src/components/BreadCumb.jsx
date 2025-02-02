import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ links, userId }) => {
  return (
    <div className="breadcrumbs text-sm mb-4">
      <ul className="flex space-x-2">
        {links.map((link, index) => (
          <li key={index} className="flex items-center">
            <Link to={link.path} className="flex items-center text-blue-500 hover:text-blue-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-4 w-4 stroke-current mr-1">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
              </svg>
              {link.label}
            </Link>
            {index < links.length - 1 && <span className="text-gray-400">&gt;</span>}
          </li>
        ))}
        {userId && (
          <li className="flex items-center">
            <span className="text-gray-500">User  ID: {userId}</span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Breadcrumb;