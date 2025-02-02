// src/components/SearchFilterPembelian.js
import React from 'react';

const SearchFilter = ({ searchPemasok, setSearchPemasok, searchSparepart, setSearchSparepart }) => {
  return (
    <div className="mb-4 flex">
      <input
        type="text"
        placeholder="Cari Pemasok"
        value={searchPemasok}
        onChange={(e) => setSearchPemasok(e.target.value)}
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