import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const devHost = Constants.expoConfig?.hostUri?.split(":")[0];
const baseURL = devHost ? `http://${devHost}:8000/api` : "http://10.0.2.2:8000/api";

const api = axios.create({ baseURL });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;