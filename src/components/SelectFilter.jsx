// src/components/SelectFilter.js
import React from 'react';

const SelectFilter = ({ options, selectedValue, onChange, placeholder }) => {
  return (
    <select
      value={selectedValue}
      onChange={(e) => onChange(e.target.value)}
      className="select select-bordered w-full max-w-xs mb-4"
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectFilter;