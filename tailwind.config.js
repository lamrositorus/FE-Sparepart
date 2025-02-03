/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'; // Import daisyUI

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1F2937', // Darker shade for better contrast
        secondary: '#F9FAFB', // Light gray for a softer look
        success: '#4CAF50', // Green for success
        info: '#2196F3', // Blue for info
        warning: '#FF9800', // Orange for warning
        danger: '#F44336', // Red for danger
        accent: '#3B82F6', // A vibrant blue for accents
        muted: '#6B7280', // A muted gray for less emphasis
      },
    },
  },
  plugins: [
    daisyui, // Then add daisyUI
  ],
};
