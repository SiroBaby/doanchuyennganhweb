import React from 'react';
import Image from 'next/image'; // Dùng cho hình ảnh
import { TextField, Button } from '@mui/material'; // Material UI components

const SignInPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-start p-4 bg-transparent h-40">
        {/* Logo dịch sang bên phải */}
        <div className="w-2/12 flex justify-center">
          <Image src="/logo/logo.png" width={120} height={0} alt="logo" />
        </div>
      </header>

      <main className="flex py-5 justify-center space-x-8 mx-4"> {/* Thêm space-x-8 để nới rộng khoảng cách */}
        {/* Div chứa form đăng nhập */}
        <div className="flex flex-col w-4/12 p-8"> {/* Chiếm 4 cột */}
          <div className="flex flex-col justify-center h-full">
            {/* Tên trang web */}
            <h1 className="text-4xl font-bold text-center mb-4" style={{ color: '#FF5E5E' }}>VAA TRAVEL</h1>

            {/* Form đăng nhập */}
            <div className="flex justify-center">
              <form className="flex flex-col items-center space-y-4 bg-white border border-gray-400 rounded-xl p-6" style={{ width: '424px', height: '464px', borderWidth: '1px' }}>
                <TextField
                  label="để cho zui chớ chưa có nhét mẫu của clerk"
                  variant="outlined"
                  required
                  InputProps={{ style: { height: '51px', width: '402px' } }} // Kích thước TextField
                />
                <TextField
                  label="đúng gòi đó này để nhập pass á"
                  type="password"
                  required
                  InputProps={{ style: { height: '51px', width: '402px' } }} // Kích thước TextField
                />
                <Button className='bg-red-500' variant="contained" color="primary" type="submit">
                  chuẩn đét lun LOGINNN
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Div chứa hình ảnh */}
        <div className="flex items-center justify-center w-8/12 bg-gray-100 rounded-3xl overflow-hidden" style={{ width: '663px', height: '667px', borderWidth: '1px' }}>
          <Image
            src="/nhatho.png" // Đường dẫn đến hình ảnh
            alt="Sign In Image"
            width={663}
            height={667}
            className="object-cover w-full h-full"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4">
        <div className="text-center bg-blue-100">
          <p>này chưa làm lười</p>
          <p>này chưa làm lười</p>
          <p>này chưa làm lười</p>
          <p>này chưa làm lười</p>
          <p>này chưa làm lười</p>
          <p>này chưa làm lười</p>
          <p>này chưa làm lười</p>
          <p>này chưa làm lười</p>
          <p>này chưa làm lười</p>
          <p>này chưa làm lười</p>
          <p>này chưa làm lười</p>
        </div>

        <div className="text-center">
          <p>Đồ án chuyên ngành - Học kì I - 2024-2025</p>
        </div>
      </footer>
    </div>
  );
};

export default SignInPage;
