"use client"

import { axiosInstance } from "@/app/axios";
import { googleLogout } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";

export const fetchData = async ({ maxRes,token,setLoading, setData }: { maxRes: number, token:string|null, 
    setLoading:Dispatch<SetStateAction<boolean>> 
setData:Dispatch<SetStateAction<any>>}) => {
    setLoading(true);
    
    try {
      
      const response = await axiosInstance.get(
        '/users/me/messages',
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            maxResults: maxRes,
            labelIds: 'INBOX'
          },
        }
      );
      response.data.messages.forEach(async (message: any) => {
        const res = await axiosInstance.get(`/users/me/messages/${message.id}`, {
          params: {format:'full'},
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        //@ts-ignore
        setData((prev) => [...prev, res.data]);
        console.log(res.data);
      })
      setLoading(false);
    } catch (e) {
      console.log(e);
      toast.error("Error Fetching Mails. Session expired");
      googleLogout();
      typeof window !== 'undefined' && localStorage.removeItem('token');
      window.location.href = '/emails';
    }
    
  }



export const classifyEmails = async ({setLabelLoading, data, setLabels,key}:{
    setLabelLoading: Dispatch<SetStateAction<boolean>>,
    data: any[],
    setLabels: Dispatch<SetStateAction<string[] | null>>,
    key: string|null
}) => {
    setLabelLoading(true);
    try{
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/classify`,{
        data: {
            emails:data.map((item:any)=>[item.snippet, item.payload.headers.find((header: {name:string, value:string}) => header.name === 'Subject')?.value]),
            apiKey: key
        }
        })
        const {text} = res.data;

        let cleanedText = text.replaceAll('\'', '"');
        cleanedText = cleanedText.replaceAll('`', '');
        const labels = JSON.parse(cleanedText);
        setLabels(labels);  
    } catch(e:any){
        console.log(e);
        toast.error(e.response.data.error);
    }
    setLabelLoading(false);
}