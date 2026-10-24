import axios from 'axios';

const baseURL = 'http://localhost:8090/api';

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "[api]",
      error?.config?.method?.toUpperCase(),
      error?.config?.url,
      error?.response?.status,
    );
    return Promise.reject(error);
  },
);

export default api; 


/*  const api = axios.create({
  baseURL: 'https://api.dx14.com.br/', //import.meta.env.VITE_API_URL || 
  headers: {
    'Content-Type': 'application/json',
  },
}); */


 
// import axios from 'axios';

// const api = axios.create({
//  // baseURL: 'http://localhost:8090/api',
//  VITE_NEON_API_KEY:,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export default api;