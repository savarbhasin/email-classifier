import axios from "axios";
import { useRouter } from "next/navigation";

export const axiosInstance = axios.create({
    baseURL:"https://gmail.googleapis.com/gmail/v1"
})


axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        const router = useRouter();
        router.push('/login');
      }
      return Promise.reject(error);
    }
  );