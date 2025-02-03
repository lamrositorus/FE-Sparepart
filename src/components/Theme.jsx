// src/components/ThemeToggle.js
import React, { useEffect } from 'react';

const ThemeToggle = () => {
  const handleThemeChange = (event) => {
    const theme = event.target.checked ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <label className="flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="toggle toggle-primary"
        onChange={handleThemeChange}
        defaultChecked={localStorage.getItem('theme') === 'dark'}
      />
      <span className="ml-2">Toggle Dark Mode</span>
    </label>
  );
};

export default ThemeToggle;
