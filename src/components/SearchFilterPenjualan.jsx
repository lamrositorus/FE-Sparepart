// src/components/SearchFilter.js
import React from 'react';

const SearchFilter = ({
  searchCustomer,
  setSearchCustomer,
  searchSparepart,
  setSearchSparepart,
}) => {
  return (
    <div className="mb-4 flex">
      <input
        type="text"
        placeholder="Cari Customer"
        value={searchCustomer}
        onChange={(e) => setSearchCustomer(e.target.value)}
        className="input input-bordered mr-2 w-1/3"
      />
      <input
        type="text"
        placeholder="Cari Sparepart"
        value={searchSparepart}
        onChange={(e) => setSearchSparepart(e.target.value)}
        className="input input-bordered w-1/3"
      />
    </div>
  );
};

export default SearchFilter;