// "use client";
// import { googleLogout } from "@react-oauth/google";

// import { useRouter } from "next/navigation";
// import { ChangeEventHandler, useEffect, useRef, useState } from "react";

// import { classifyEmails, fetchData } from "@/lib/emails";



// export default function Home() {

//   const [loading,setLoading] = useState(false);
//   const [labels,setLabels] = useState<string[] | null>(null);
//   const [labelLoading,setLabelLoading] = useState(false);
//   const [key,setKey] = useState<string | null>(null);

//   const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

//   const router = useRouter();
//   const hasFetchedData = useRef(false);
//   const [data, setData] = useState<any>([]);
//   const [modalData, setModalData] = useState<any>(null);
//   const [open,setOpen] = useState(false);

//   useEffect(() => {
//     if (!token) {
//       router.push('/login');
//     }

//     const key = typeof window !== 'undefined' ? localStorage.getItem('apiKey') : null;
//     if(key){
//       setKey(key);
//     }

//     if (!hasFetchedData.current) {
//       hasFetchedData.current = true;
//       fetchData({ maxRes: 5, token, setLoading,setData});
//     }
//   }, [token,router])


  

//   const changeHandler: ChangeEventHandler<HTMLSelectElement> = (e) => {
//     setData([]);
//     setLabels(null);
//     fetchData({ maxRes: Number(e.target.value), token, setLoading,setData});
//   }


//   const clickHandler  = (item:any)=>{
//     setModalData(item)
//     setOpen(true);

//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
//       <div className="flex justify-between w-full my-2 max-w-4xl items-center">
        
//         <select name="numberOfMail" id="no-of-mail" onChange={changeHandler} className="p-2 border border-gray-300 rounded-md">
//           <option defaultChecked={true} value="5">5</option>
//           {
//             [15, 20, 30].map((item, index) => (
//               <option value={item} key={index}>{item}</option>
//             ))
//           }
//         </select>
//         <button onClick={()=>{
//           googleLogout();
//           typeof window !== 'undefined' && localStorage.removeItem('token');
//           router.push('/');
//         }} className="px-3 py-2 bg-blue-500 text-white rounded-xl">Logout</button>
//         { !key? <div className="flex gap-2">
//             <input type="text" id="key-input" placeholder="Enter OpenAI key" className="rounded-xl outline-none px-3 py-2"/>
//             <button className="px-3 py-2 bg-blue-500 text-white rounded-xl" onClick={()=>{
//               const key = (document.querySelector('#key-input') as HTMLInputElement).value;
//               setKey(key);
//               typeof window !== 'undefined' && localStorage.setItem('apiKey',key);
//             }}>
//               Save
//             </button>
//         </div>:
//           <div className="flex gap-2">
//             <button onClick={()=>{
//               setKey(null);
//               typeof window !== 'undefined' && localStorage.removeItem('apiKey');
//             }} className="px-3 py-2 bg-blue-500 text-white rounded-xl">Change Key</button>
//             <button onClick={()=>classifyEmails({setLabels,setLabelLoading,data,key})} className="px-3 py-2 bg-blue-500 text-white rounded-xl">Classify</button>
//           </div>
//         }
//       </div>
//       <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 overflow-y-auto h-[25rem]">
//         {
//           loading && 
//           Array.from({ length: 5 }).map((_, index) => {
//             return (
//             <div key={index}>
//               <div className="border-b border-gray-200 py-4 flex flex-row justify-between items-center">
//                 <div className="flex flex-col gap-2 max-w-[40rem]">
//                   <div className="shimmer-wrapper" style={{width:'200px'}}></div>
//                   <div className="shimmer-wrapper" style={{width:'450px'}}></div>
//                 </div>
//                 <div className="shimmer-wrapper"></div>
//               </div>
//             </div>)
//           })
//         }
//         {
//           data
//           &&
//           data.map((item: any, index: number) => (
//             <div className="border-b border-gray-200 py-4 flex flex-row justify-between items-center cursor-pointer" onClick={()=>clickHandler(item)} key={index}>
//               <div className="flex flex-col gap-2 max-w-[40rem]">
//                 <p className="font-light text-sm text-gray-500">From: {item.payload.headers.find((header: {name:string, value:string}) => header.name === 'From')?.value}</p>
//                 <h2 className="text-lg font-semibold">{item.payload.headers.find((header: {name:string, value:string}) => header.name === 'Subject')?.value}</h2>
//               </div>
              
//               {labelLoading && <div className="shimmer-wrapper"></div>}
//               {labels && <p className='text-md font-medium'>{labels[index]}</p>}
//             </div>
//           ))
//         }
//       </div>
//       <div className={`${open ? 'scale-100':'scale-0'} overflow-y-auto transition-all bg-slate-200 px-20 py-10 duration-250 right-0 ease-in absolute h-screen`}>
//         {modalData && 
//         <div className="max-w-4xl flex flex-col gap-5">
//             <h2 className="flex items-center flex-row justify-between w-full">
//               {modalData.payload.headers.find((header: {name:string, value:string}) => header.name === 'From')?.value}
//               <span onClick={()=>setOpen(false)} className="bg-red-500 cursor-pointer flex text-white justify-center items-center px-4 py-2 rounded-full">X</span>
//             </h2>
//             <h3>{modalData.payload.headers.find((header:{name:string,value:string})=>header.name=='Subject')?.value}</h3>
//             <p>
//               {
//                 modalData.payload.parts && modalData.payload.parts.map((part:any,index:number)=>(
//                   index==1 && <div key={index} dangerouslySetInnerHTML={{__html:Buffer.from(part.body.data, 'base64').toString('utf-8')}}></div>
//                 ))
//               }
//             </p>
            

          
//         </div>}
//       </div>
//     </div>
//   )
// }
"use client";
import { googleLogout } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { classifyEmails, fetchData } from "@/lib/emails";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [labels, setLabels] = useState<string[] | null>(null);
  const [labelLoading, setLabelLoading] = useState(false);
  const [key, setKey] = useState<string | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const router = useRouter();
  const hasFetchedData = useRef(false);
  const [data, setData] = useState<any>([]);
  const [modalData, setModalData] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
    const key = typeof window !== 'undefined' ? localStorage.getItem('apiKey') : null;
    if (key) {
      setKey(key);
    }
    if (!hasFetchedData.current) {
      hasFetchedData.current = true;
      fetchData({ maxRes: 5, token, setLoading, setData });
    }
  }, [token, router]);

  const changeHandler: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setData([]);
    setLabels(null);
    fetchData({ maxRes: Number(e.target.value), token, setLoading, setData });
  }

  const clickHandler = (item: any) => {
    setModalData(item);
    setOpen(true);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <div className="flex justify-between w-full my-2 max-w-4xl items-center">
        <select name="numberOfMail" id="no-of-mail" onChange={changeHandler} className="p-2 border border-gray-300 rounded-md">
          <option defaultChecked={true} value="5">5</option>
          {[15, 20, 30].map((item, index) => (
            <option value={item} key={index}>{item}</option>
          ))}
        </select>
        <button
          onClick={() => {
            googleLogout();
            typeof window !== 'undefined' && localStorage.removeItem('token');
            router.push('/');
          }}
          className="px-3 py-2 bg-blue-500 text-white rounded-xl"
        >
          Logout
        </button>
        {!key ? (
          <div className="flex gap-2">
            <input
              type="text"
              id="key-input"
              placeholder="Enter OpenAI key"
              className="rounded-xl outline-none px-3 py-2"
            />
            <button
              className="px-3 py-2 bg-blue-500 text-white rounded-xl"
              onClick={() => {
                const key = (document.querySelector('#key-input') as HTMLInputElement).value;
                setKey(key);
                typeof window !== 'undefined' && localStorage.setItem('apiKey', key);
              }}
            >
              Save
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setKey(null);
                typeof window !== 'undefined' && localStorage.removeItem('apiKey');
              }}
              className="px-3 py-2 bg-blue-500 text-white rounded-xl"
            >
              Change Key
            </button>
            <button
              onClick={() => classifyEmails({ setLabels, setLabelLoading, data, key })}
              className="px-3 py-2 bg-blue-500 text-white rounded-xl"
            >
              Classify
            </button>
          </div>
        )}
      </div>
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 overflow-y-auto h-[25rem]">
        {loading &&
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="border-b border-gray-200 py-4 flex flex-row justify-between items-center">
              <div className="flex flex-col gap-2 max-w-[40rem]">
                <div className="shimmer-wrapper" style={{ width: '200px' }}></div>
                <div className="shimmer-wrapper" style={{ width: '450px' }}></div>
              </div>
              <div className="shimmer-wrapper"></div>
            </div>
          ))}
        {data && data.map((item: any, index: number) => (
          <div
            className="border-b border-gray-200 py-4 flex flex-row justify-between items-center cursor-pointer"
            onClick={() => clickHandler(item)}
            key={index}
          >
            <div className="flex flex-col gap-2 max-w-[40rem]">
              <p className="font-light text-sm text-gray-500">
                From: {item.payload.headers.find((header: { name: string, value: string }) => header.name === 'From')?.value}
              </p>
              <h2 className="text-lg font-semibold">
                {item.payload.headers.find((header: { name: string, value: string }) => header.name === 'Subject')?.value}
              </h2>
            </div>
            {labelLoading && <div className="shimmer-wrapper"></div>}
            {labels && <p className='text-md font-medium'>{labels[index]}</p>}
          </div>
        ))}
      </div>
      <div className={`${open ? 'scale-100' : 'scale-0'} overflow-y-auto transition-all bg-slate-200 px-20 py-10 duration-250 right-0 ease-in absolute h-screen`}>
        {modalData && (
          <div className="max-w-4xl flex flex-col gap-5">
            <h2 className="flex items-center flex-row justify-between w-full">
              {modalData.payload.headers.find((header: { name: string, value: string }) => header.name === 'From')?.value}
              <span onClick={() => setOpen(false)} className="bg-red-500 cursor-pointer flex text-white justify-center items-center px-4 py-2 rounded-full">X</span>
            </h2>
            <h3>{modalData.payload.headers.find((header: { name: string, value: string }) => header.name === 'Subject')?.value}</h3>
            <p>
              {modalData.payload.parts && modalData.payload.parts.map((part: any, index: number) => (
                index === 1 && <div key={index} dangerouslySetInnerHTML={{ __html: Buffer.from(part.body.data, 'base64').toString('utf-8') }}></div>
              ))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
