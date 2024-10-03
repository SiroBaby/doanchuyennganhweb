import React from 'react';
import Image from 'next/image'; // Dùng cho hình ảnh
import { TextField, Button } from '@mui/material'; // Material UI components

const SignInPage = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-transparent h-16 bg-red-300 text-center">
        <p>mở bự cái này ra coi ụ ẹ</p>
        <p>tượng trưng thoi</p>
      </header>

      <main className="flex flex-grow py-5">
        {/* Bên Trái : Nội dung chính */}
        <div className="flex flex-col w-1/2 p-8">
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

        {/* Bên Phải: Hình ảnh */}
        <div className="flex items-center justify-center w-1/2 bg-gray-100 rounded-3xl" style={{ width: '667px', height: '663px', borderWidth: '1px' }}>
          <Image
            src="/path/to/your/image.jpg" // Thay đổi đường dẫn đến hình ảnh
            alt="Sign In Image"
            width={300} // Kích thước hình ảnh
            height={300} // Kích thước hình ảnh
            className="rounded-full"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4" >
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
