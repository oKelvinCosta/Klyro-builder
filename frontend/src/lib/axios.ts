import axios from 'axios';
import { getAuth } from 'firebase/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // withCredentials: true, // Cookies from frontend send to backend to manage authentication
});

// Before every requisition, delay
if (import.meta.env.VITE_ENABLE_API_DELAY === 'TRUE') {
  api.interceptors.response.use(async (config) => {
    await new Promise((resolve) => setTimeout(resolve, randomDelay()));
    return config;
  });
}
// between 800 and 2800
function randomDelay(): number {
  // return Math.floor(Math.random() * 1000) + 1000;
  return 0;
}

// Add token to every request
api.interceptors.request.use(
  async (config) => {
    // call directly the firebase, or can call the zustand state
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export { api };
