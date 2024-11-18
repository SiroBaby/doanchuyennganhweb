"use client";

import { useState } from "react";

interface OrderInfo {
  ticketQuantity: number;
  bankCode: string;
  language: string;
}

const PaymentPage = () => {
  const [orderInfo, setOrderInfo] = useState<OrderInfo>({
    ticketQuantity: 1,
    bankCode: '',
    language: 'vn'
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [paymentUrl, setPaymentUrl] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderInfo({
      ...orderInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Tính toán số tiền dựa trên số lượng vé
      const amount = orderInfo.ticketQuantity * 100000; // 100,000 VND per ticket
      const orderId = `ORDER_${Math.floor(Date.now() / 1000)}`;
      
      const response = await fetch("/api/create-payment-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          amount,
          orderInfo: `Thanh toán ${orderInfo.ticketQuantity} vé`,
          bankCode: orderInfo.bankCode,
          language: orderInfo.language,
          ipAddr: "127.0.0.1" // Trong thực tế nên lấy IP thật của người dùng
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      
      if (data.success && data.paymentUrl) {
        // Chuyển hướng người dùng đến trang thanh toán VNPay
        window.location.href = data.paymentUrl;
      } else {
        alert('Không thể tạo URL thanh toán. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-2xl font-bold mb-4">Tạo thanh toán</h3>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          {/* Số lượng vé */}
          <div className="mb-4">
            <label className="block mb-2">Số lượng vé</label>
            <input
              type="number"
              name="ticketQuantity"
              value={orderInfo.ticketQuantity}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Phương thức thanh toán */}
          <div className="mb-4">
            <label className="block mb-2">Chọn Phương thức thanh toán:</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="bankCode"
                  value=""
                  checked={orderInfo.bankCode === ""}
                  onChange={handleChange}
                  className="mr-2"
                />
                Cổng thanh toán VNPAYQR
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="bankCode"
                  value="VNPAYQR"
                  checked={orderInfo.bankCode === "VNPAYQR"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Thanh toán qua ứng dụng hỗ trợ VNPAYQR
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="bankCode"
                  value="VNBANK"
                  checked={orderInfo.bankCode === "VNBANK"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Thanh toán qua ATM-Tài khoản ngân hàng nội địa
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="bankCode"
                  value="INTCARD"
                  checked={orderInfo.bankCode === "INTCARD"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Thanh toán qua thẻ quốc tế
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Thanh toán
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
