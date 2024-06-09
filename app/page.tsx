"use client"
import { useGoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const Page = () => {

    const router = useRouter();
    const [validating,setValidating] = useState(true);   
    const token = localStorage.getItem('token');
    useEffect(()=>{
        if(token){
            router.push('/emails');
        }
        setValidating(false);
    },[router,token])

    const login = useGoogleLogin({
        onSuccess: async (response) => {
            localStorage.setItem('token', response.access_token);
            router.push('/emails');
            toast.success("Login Successful");
        },
        scope: 'https://www.googleapis.com/auth/gmail.readonly',
        include_granted_scopes: true,
    });

    if(validating){
        return (
            <div className='shimmer-wrapper' style={{width:'100vw'}}></div>
        )
    }

    return (
        <div className="relative flex items-center justify-center min-h-screen ">
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="relative z-10 p-8 rounded-2xl shadow-2xl bg-white bg-opacity-10 backdrop-blur-md max-w-lg mx-auto">
                <div className="flex justify-center mb-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h1 className="text-4xl font-extrabold mb-4 text-white text-center leading-tight">
                    Welcome to<br /><span className="text-white">Email Manager</span>
                </h1>
                <p className="text-lg mb-8 text-gray-200 text-center">
                    Manage your Gmail effortlessly. Automatically label emails as spam, important, and more.
                </p>
                <button 
                    className="w-full text-white font-bold py-3 px-6 rounded-full border-2 flex items-center justify-center"
                    onClick={() => login()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        <path d="M1 1h22v22H1z" fill="none"/>
                    </svg>
                    Login with Google
                </button>
                <div className="mt-8 text-center text-gray-300">
                    <p>By logging in, you agree to our</p>
                    <a href="#" className="text-blue-500 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
                </div>
            </div>
            
            
        </div>
    );
};

export default Page;