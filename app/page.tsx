"use client";
import { googleLogout } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "./axios";


export default function Home() {

  const [loading,setLoading] = useState(false);
  const [labels,setLabels] = useState<string[] | null>(null);
  const [labelLoading,setLabelLoading] = useState(false);
  const [key,setKey] = useState<string | null>(null);

  const token = localStorage.getItem('token');
  const router = useRouter();
  const hasFetchedData = useRef(false);


  useEffect(() => {
    if (!token) {
      router.push('/login');
    }

    const key = localStorage.getItem('apiKey');
    if(key){
      setKey(key);
    }

    if (!hasFetchedData.current) {
      hasFetchedData.current = true;
      fetchData({ maxRes: 5 });
    }
  }, [token,router])

  const [data, setData] = useState([]);

  
  axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
      
        const router = useRouter();
        router.push('/login');
        toast.error("Session Expired. Please login again");
        return Promise.reject(error);
      }
    );

  const fetchData = async ({ maxRes }: { maxRes: number }) => {
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
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        //@ts-ignore
        setData((prev) => [...prev, res.data]);
      })
      setLoading(false);
    } catch (e) {
      console.log(e);
      toast.error("Error Fetching Mails");
      googleLogout();
    }
    
  }

  const changeHandler: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setData([]);
    setLabels(null);
    fetchData({ maxRes: Number(e.target.value) });
  }


  const clickHandler = async () => {
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <div className="flex justify-between w-full my-2 max-w-4xl items-center">
        
        <select name="numberOfMail" id="no-of-mail" onChange={changeHandler} className="p-2 border border-gray-300 rounded-md">
          <option defaultChecked={true} value="5">5</option>
          {
            [15, 20, 30].map((item, index) => (
              <option value={item} key={index}>{item}</option>
            ))
          }
        </select>
        <button onClick={()=>{
          googleLogout();
          localStorage.removeItem('token');
          router.push('/login');
        }} className="px-3 py-2 bg-blue-500 text-white rounded-xl">Logout</button>
        { !key? <div className="flex gap-2">
            <input type="text" id="key-input" placeholder="Enter OpenAI key" className="rounded-xl outline-none px-3 py-2"/>
            <button className="px-3 py-2 bg-blue-500 text-white rounded-xl" onClick={()=>{
              const key = (document.querySelector('#key-input') as HTMLInputElement).value;
              setKey(key);
              localStorage.setItem('apiKey',key);
            }}>
              Save
            </button>
        </div>:
          <div className="flex gap-2">
            <button onClick={()=>{
              setKey(null);
              localStorage.removeItem('apiKey');
            }} className="px-3 py-2 bg-blue-500 text-white rounded-xl">Change Key</button>
            <button onClick={clickHandler} className="px-3 py-2 bg-blue-500 text-white rounded-xl">Classify</button>
          </div>
        }
      </div>
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 overflow-y-auto h-[25rem]">
        {
          loading && 
          Array.from({ length: 5 }).map((_, index) => {
            return (
            <div key={index}>
              <div className="border-b border-gray-200 py-4 flex flex-row justify-between items-center">
                <div className="flex flex-col gap-2 max-w-[40rem]">
                  <div className="shimmer-wrapper" style={{width:'200px'}}></div>
                  <div className="shimmer-wrapper" style={{width:'450px'}}></div>
                </div>
                <div className="shimmer-wrapper"></div>
              </div>
            </div>)
          })
        }
        {
          data
          &&
          data.map((item: any, index: number) => (
            <div className="border-b border-gray-200 py-4 flex flex-row justify-between items-center" key={index}>
              <div className="flex flex-col gap-2 max-w-[40rem]">
                <p className="font-light text-sm text-gray-500">From: {item.payload.headers.find((header: {name:string, value:string}) => header.name === 'From')?.value}</p>
                <h2 className="text-lg font-semibold">{item.payload.headers.find((header: {name:string, value:string}) => header.name === 'Subject')?.value}</h2>
              </div>
              
              {labelLoading && <div className="shimmer-wrapper"></div>}
              {labels && <p className='text-md font-medium'>{labels[index]}</p>}
            </div>
          ))
        }
      </div>
    </div>
  )
}
