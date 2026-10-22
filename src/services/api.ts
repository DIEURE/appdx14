import axios from 'axios';

// Captura a chave que você salvou no arquivo .env do seu projeto
const NEON_TOKEN = import.meta.env.VITE_NEON_API_KEY;

const api = axios.create({
  // 1. URL base oficial da API do Neon
  baseURL: 'https://neon.tech',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // 2. A chave do Neon DEVE ser passada aqui no formato Bearer
    'Authorization': `Bearer ${NEON_TOKEN}`,
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