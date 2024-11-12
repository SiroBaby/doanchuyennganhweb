import { SignUp } from '@clerk/nextjs';
import Image from 'next/image'; // Import Image từ Next.js
import React from 'react';

const RegisterPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-100">
      <div className="bg-white rounded-3xl shadow-xl p-10 flex justify-center items-center space-x-10">
        {/* Left Side: Image and Text */}
        <div className="flex flex-col items-center h-full justify-center">
          {/* Sử dụng Image từ Next.js */}
          <Image
            src="/reg-pic.jpeg"
            alt="Travel"
            width={320} 
            height={320} 
            className="rounded-xl" 
          />
          <h2 className="text-2xl text-gray-800 text-center mt-6">
            Du lịch theo cách sống của bạn
          </h2>
        </div>

        {/* Right Side: Clerk SignUp Form */}
        <div className="h-full flex items-center">
          <SignUp
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
            appearance={{
              variables: {
                colorPrimary: '#ec4899',
                //colorPrimaryHover: '#db2777',
              },
              elements: {
                formButtonPrimary:
                  'w-full p-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600',
                formFieldLabel: 'text-gray-800',
                formFieldInput:
                  'w-full p-3 border border-gray-300 rounded-lg',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
