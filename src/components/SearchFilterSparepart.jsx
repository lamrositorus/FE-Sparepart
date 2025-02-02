// src/components/SearchFilter.js
import React from 'react';

const SearchFilter = ({ searchSparepart, setSearchSparepart }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Cari Sparepart"
        value={searchSparepart}
        onChange={(e) => setSearchSparepart(e.target.value)}
        className="input input-bordered w-full mt-2"
      />
    </div>
  );
};

export default SearchFilter;