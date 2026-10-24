import axios from 'axios';
 const api = axios.create({
  baseURL: 'https://api.dx14.com.br/', //import.meta.env.VITE_API_URL || 
  headers: {
    'Content-Type': 'application/json',
  },
});
export default api;








 
// import axios from 'axios';

// const api = axios.create({
//  // baseURL: 'http://localhost:8090/api',
//  VITE_NEON_API_KEY:,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export default api;