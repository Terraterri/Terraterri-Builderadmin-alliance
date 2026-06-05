// import axios from 'axios';

// // const authClient = axios.create({
// //   baseURL: 'https://micro-api-one.terraterri.com/api',
// //   headers: {
// //     'Content-Type': 'application/json',
// //     Authorization: `Bearer ${localStorage.getItem('adminToken')}`
// //   }
// // });

// const authClient = axios.create({
//   baseURL: 'https://micro-api-one.terraterri.com/api',
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// // Add an interceptor to set the token before each request
// authClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('adminToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// const masterClient = axios.create({
//   baseURL: 'https://micro-api-three.terraterri.com/api/',
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${localStorage.getItem('adminToken')}`
//   }
// });

// const projectClient = axios.create({
//   baseURL: 'https://micro-api-two.terraterri.com/api/project/',
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${localStorage.getItem('adminToken')}`
//   }
// });

// const expoClient = axios.create({
//   baseURL: 'https://mmworkspace.com/expo/api/',
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${localStorage.getItem('adminToken')}`
//   }
// });

// const expoApiClient = axios.create({
//   baseURL: `https://expoadminapi.terraterri.com/tt-expo-builder-be/`,
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${localStorage.getItem('adminToken')}`
//   }
// });

// // Creating an New API Client for Admin Expo
// const expoAdminClient = axios.create({
//   baseURL: 'https://expoadminapi.terraterri.com/',
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJudW1iZXIiOiI5MDYzNzU0MzIxIiwiaWF0IjoxNzMxNDc2MzYxLCJuYmYiOjE3MzE0NzYzNjEsImV4cCI6MTczMTU2Mjc2MX0.jfahNBh_28ap4VGQCVVu63QR0aJGxvAI9l391lqL82U`
//   }
// });

// export { authClient, masterClient, projectClient, expoClient, expoApiClient, expoAdminClient };
import axios from 'axios';
import { environment } from './environment';

const attachAuthToken = (config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Factory function to create axios clients
const createClient = (baseURL) => {
  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  client.interceptors.request.use(attachAuthToken, (error) => Promise.reject(error));
  return client;
};

// Create API clients
const authClient = createClient(`${environment.userEndpoint}/api`);
const masterClient = createClient(`${environment.mastersEndPoint}/api/`);
const projectClient = createClient(`${environment.servicesEndPoint}/api/project/`);
const websiteClient = createClient(`${environment.websiteEndPoint}/api/v1/`);
const expoClient = createClient(`https://mmworkspace.com/expo/api/`);
const expoApiClient = createClient(`${environment.expoApiEndPoint}`);
const expoAdminClient = createClient(`${environment.expoAdminEndPoint}`);
export { authClient, masterClient, projectClient, expoClient, expoApiClient, expoAdminClient, websiteClient };
