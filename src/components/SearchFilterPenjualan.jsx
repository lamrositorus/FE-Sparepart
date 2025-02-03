import React from 'react';

const SearchFilter = ({
  searchCustomer,
  setSearchCustomer,
  searchSparepart,
  setSearchSparepart,
}) => {
  return (
    <div className="mb-4 flex flex-col md:flex-row">
      <input
        type="text"
        placeholder="Cari Customer"
        value={searchCustomer}
        onChange={(e) => setSearchCustomer(e.target.value)}
        className="input input-bordered mb-2 md:mb-0 md:mr-2 w-full md:w-1/3"
      />
      <input
        type="text"
        placeholder="Cari Sparepart"
        value={searchSparepart}
        onChange={(e) => setSearchSparepart(e.target.value)}
        className="input input-bordered w-full md:w-1/3"
      />
    </div>
  );
};

export default SearchFilter;
