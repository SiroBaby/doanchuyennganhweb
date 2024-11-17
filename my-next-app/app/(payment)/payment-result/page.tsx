"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// Định nghĩa interface cho response codes
interface ResponseMessages {
  [key: string]: {
    success: boolean;
    message: string;
  };
}

const RESPONSE_CODES: ResponseMessages = {
  "00": {
    success: true,
    message: "Giao dịch thành công"
  },
  "07": {
    success: true,
    message: "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)."
  },
  "09": {
    success: false,
    message: "Giao dịch không thành công do: Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking."
  },
  "10": {
    success: false,
    message: "Giao dịch không thành công do: Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần"
  },
  "11": {
    success: false,
    message: "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Vui lòng thực hiện lại giao dịch."
  },
  "12": {
    success: false,
    message: "Giao dịch không thành công do: Thẻ/Tài khoản bị khóa."
  },
  "13": {
    success: false,
    message: "Giao dịch không thành công do: Nhập sai mật khẩu xác thực (OTP). Vui lòng thực hiện lại giao dịch."
  },
  "24": {
    success: false,
    message: "Giao dịch không thành công do: Khách hàng hủy giao dịch"
  },
  "51": {
    success: false,
    message: "Giao dịch không thành công do: Số dư tài khoản không đủ."
  },
  "65": {
    success: false,
    message: "Giao dịch không thành công do: Tài khoản đã vượt quá hạn mức giao dịch trong ngày."
  },
  "75": {
    success: false,
    message: "Ngân hàng thanh toán đang bảo trì."
  },
  "79": {
    success: false,
    message: "Giao dịch không thành công do: Nhập sai mật khẩu thanh toán quá số lần quy định."
  },
  "99": {
    success: false,
    message: "Giao dịch không thành công do lỗi hệ thống."
  }
};

const PaymentResult = () => {
  const searchParams = useSearchParams();
  const [result, setResult] = useState({ success: false, message: "" });

  useEffect(() => {
    const processPaymentResult = () => {
      const responseCode = searchParams.get("vnp_ResponseCode");
      
      if (responseCode) {
        const response = RESPONSE_CODES[responseCode] || {
          success: false,
          message: "Lỗi không xác định. Vui lòng liên hệ bộ phận hỗ trợ."
        };

        setResult(response);
      }
    };

    processPaymentResult();
  }, [searchParams]);

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Kết quả thanh toán</h1>
        <div className={`p-4 rounded ${result.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          <p className="text-center font-medium">{result.message}</p>
        </div>
        <div className="mt-6 text-center">
          <a 
            href="/" 
            className="text-blue-500 hover:text-blue-600 underline"
          >
            Quay về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
