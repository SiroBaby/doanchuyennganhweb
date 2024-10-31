import React from 'react';

const RegisterForm: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-100">
      <div className="bg-white rounded-3xl shadow-xl p-10 flex">
        {/* Phần bên trái chứa ảnh và text */}
        <div className="flex flex-col items-center pr-10">
          <img
            src="reg-pic.jpeg"
            alt="Travel"
            className="rounded-xl w-80"
          />
          <h2 className="text-2xl text-gray-800 text-center mt-6">
            Du lịch theo cách sống của bạn
          </h2>
        </div>

        {/* Phần bên phải chứa form đăng ký */}
        <div className="bg-white rounded-lg p-8 w-80">
          <h2 className="text-2xl text-blue-600 text-center mb-6">Đăng ký</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Họ và tên"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="email"
              placeholder="Email..."
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="tel"
              placeholder="Số điện thoại"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Tên đăng nhập"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="password"
              placeholder="Nhập lại mật khẩu..."
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <button
              type="submit"
              className="w-full p-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
