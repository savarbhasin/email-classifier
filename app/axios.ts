import axios from "axios";


export const axiosInstance = axios.create({
    baseURL:"https://gmail.googleapis.com/gmail/v1"
})

