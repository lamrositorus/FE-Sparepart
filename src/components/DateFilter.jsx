// src/components/DateFilter.js
import React from 'react';

const DateFilter = ({ filterDateRange, setFilterDateRange }) => {
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value ? new Date(e.target.value) : null;
    setFilterDateRange([newStartDate, filterDateRange[1]]);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value ? new Date(e.target.value) : null;
    setFilterDateRange([filterDateRange[0], newEndDate]);
  };

  return (
    <div className="mb-4 flex">
      <input
        type="date"
        onChange={handleStartDateChange}
        className="input input-bordered mr-2 w-1/3"
      />
      <input
        type="date"
        onChange={handleEndDateChange}
        className="input input-bordered w-1/3"
      />
    </div>
  );
};

export default DateFilter;