import { SignIn } from '@clerk/nextjs';
import React from 'react';
import Image from 'next/image'; // Dùng cho hình ảnh

const SignInPage = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex justify-start bg-custom-blue p-3 bg-transparent h-40">
        <div className="w-2/12 flex justify-center">
          <Image src="/logo/logo.png" width={120} height={0} alt="logo" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex justify-center">
        {/* Form đăng nhập từ Clerk */}
        <div className="flex flex-col w-4/12 p-8"> 
          <div className="flex flex-col justify-center h-full">
            <h1 className="text-4xl font-bold text-center mb-4" style={{ color: '#FF5E5E' }}>VAA TRAVEL</h1>

            {/* Form đăng nhập Clerk */}
            <div className="flex justify-center">
              <div className="flex flex-col" >
                <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
              </div>
            </div>
          </div>
        </div>

        {/* Hình ảnh bên phải */}
        <div className="flex items-center justify-center w-8/12 bg-gray-100 rounded-3xl overflow-hidden" style={{ width: '580px', height: '580px', borderWidth: '1px' }}>
          <Image
            src="/nhatho.png" // Đường dẫn đến hình ảnh
            alt="Sign In Image"
            width={580}
            height={580}
            className="object-cover w-full h-full"
          />
        </div>
      </main>
    </div>
  );
};

export default SignInPage;