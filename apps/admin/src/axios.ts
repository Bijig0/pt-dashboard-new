import axios from "axios";
import getTokens from "./helpers/auth/getTokens";
// import { getTokens } from './auth';
// import { DEV_MODE } from './flags';

// const baseURL = DEV_MODE ? 'http://localhost:8000' : 'https://www.api-intstitute.com'

export const baseURL = "http://localhost:3000/";
const axiosClient = axios.create({
  baseURL: baseURL,
});

axiosClient.interceptors.request.use(async function (config) {
  console.log(
    `Intercepting a network request to url ${JSON.stringify(
      config.url
    )} with headers ${JSON.stringify(config.headers)}, payload ${JSON.stringify(
      config.data
    )}`
  );
  const accessToken = getTokens("accessToken");
  // Honestly no clue, someone fix this
  if (accessToken !== "undefined" && accessToken !== undefined && accessToken) {
    console.log(
      `Interceptor attaching token to Authorization header ${accessToken}`
    );
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// So with every request send an Authorization header
// Then client side handle what to do if is authenticated or not right?

export default axiosClient;
