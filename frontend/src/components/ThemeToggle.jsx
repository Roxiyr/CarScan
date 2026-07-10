// import { useEffect, useState } from 'react';

// export const ThemeToggle = () => {
//   const [theme, setTheme] = useState('dark');

//   // Load theme from localStorage on mount
//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme') || 'dark';
//     setTheme(savedTheme);
//     document.documentElement.setAttribute('data-theme', savedTheme);
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === 'dark' ? 'light' : 'dark';
//     setTheme(newTheme);
//     localStorage.setItem('theme', newTheme);
//     document.documentElement.setAttribute('data-theme', newTheme);
//   };

//   return (
//     <button
//       onClick={toggleTheme}
//       className="theme-toggle"
//       aria-label="Toggle theme"
//       title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
//     >
//       {theme === 'dark' ? '☀️' : '🌙'}
//     </button>
//   );
// };
