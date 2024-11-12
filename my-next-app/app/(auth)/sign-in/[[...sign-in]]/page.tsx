import { SignIn } from '@clerk/nextjs';
import React from 'react';
import Image from 'next/image';

const SignInPage = () => {
  return (
    <div className="min-h-screen bg-blue-100 flex flex-col">
      <main className="flex-1 flex justify-center items-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:gap-12 items-center">
            <div className="flex flex-col justify-center items-center w-full md:w-auto">
              <div className="w-34 md:w-38 mb-6">
                <Image 
                  src="/logo/logo.png" 
                  width={100} 
                  height={0} 
                  alt="logo"
                  className="w-full h-auto" 
                />
              </div>
              
              {/* Form đăng nhập Clerk */}
              <SignIn 
                path="/sign-in" 
                routing="path" 
                signUpUrl="/sign-up"
                appearance={{
                  variables: {
                    colorPrimary: '#ec4899',
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

            <div className="hidden md:flex items-center justify-center overflow-hidden rounded-xl">
              <Image
                src="/nhatho.png"
                alt="Sign In Image"
                width={675}
                height={675}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignInPage;