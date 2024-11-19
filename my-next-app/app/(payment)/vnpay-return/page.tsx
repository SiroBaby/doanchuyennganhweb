
'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const VNPayReturn = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState('Đang xử lý kết quả thanh toán...');

  useEffect(() => {
    const updatePaymentStatus = async () => {
      try {
        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
        const vnp_TxnRef = searchParams.get('vnp_TxnRef') || '';
        const booking_id = vnp_TxnRef.split('_')[1];

        const status = vnp_ResponseCode === '00' ? 'COMPLETED' : 'CANCELLED';

        // Update booking status
        await fetch(`http://localhost:4000/api/bookings/${booking_id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            payment_status: status,
            booking_status: status === 'COMPLETED' ? 'CONFIRMED' : 'CANCELLED'
          })
        });

        // Update invoice status
        await fetch(`http://localhost:4000/api/invoices/booking/${booking_id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            payment_status: status
          })
        });

        setMessage(status === 'COMPLETED' 
          ? 'Thanh toán thành công! Đang chuyển hướng...' 
          : 'Thanh toán thất bại hoặc đã bị hủy!'
        );

        // Redirect after 3 seconds
        setTimeout(() => {
          router.push('/my-bookings');
        }, 3000);

      } catch (error) {
        console.error('Error updating payment status:', error);
        setMessage('Có lỗi xảy ra khi cập nhật trạng thái thanh toán');
      }
    };

    updatePaymentStatus();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">{message}</h1>
      </div>
    </div>
  );
};

export default VNPayReturn;