import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


export const axiosInstance = axios.create({
    baseURL:"https://gmail.googleapis.com/gmail/v1"
})


axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status !== 401) {
        return Promise.reject(error);
      }
      const router = useRouter();
      router.push('/');
      typeof window !== 'undefined' && localStorage.removeItem('token');
      toast.error("Session Expired. Please login again");
      return Promise.reject(error);
    }
  );