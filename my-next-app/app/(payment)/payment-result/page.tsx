'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const PaymentResult = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState('Đang xử lý kết quả thanh toán...');
  const [status, setStatus] = useState<'success' | 'error' | 'loading'>('loading');

  useEffect(() => {
    const updatePaymentStatus = async () => {
      try {
        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
        const vnp_TxnRef = searchParams.get('vnp_TxnRef') || '';
        const booking_id = vnp_TxnRef.split('_')[1];

        // Map response codes to payment status
        let paymentStatus;
        switch (vnp_ResponseCode) {
          case '00':
            paymentStatus = 'COMPLETED';
            setStatus('success');
            break;
          case '24':
            paymentStatus = 'CANCELLED';
            setStatus('error');
            break;
          default:
            paymentStatus = 'FAILED';
            setStatus('error');
        }

        // Update booking status
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/${booking_id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            payment_status: paymentStatus,
            booking_status: paymentStatus === 'COMPLETED' ? 'CONFIRMED' : 'CANCELLED'
          })
        });

        // Update invoice status
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/invoices/booking/${booking_id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            payment_status: paymentStatus
          })
        });

        setMessage(
          paymentStatus === 'COMPLETED'
            ? 'Thanh toán thành công! Đang chuyển hướng...'
            : paymentStatus === 'CANCELLED'
            ? 'Bạn đã hủy thanh toán'
            : 'Thanh toán thất bại!'
        );

        // Redirect after 3 seconds
        setTimeout(() => {
          router.push('/');
        }, 3000);

      } catch (error) {
        console.error('Error updating payment status:', error);
        setMessage('Có lỗi xảy ra khi cập nhật trạng thái thanh toán');
        setStatus('error');
      }
    };

    updatePaymentStatus();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        {status === 'loading' && (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
        )}
        {status === 'success' && (
          <div className="text-green-500 text-5xl mb-4">✓</div>
        )}
        {status === 'error' && (
          <div className="text-red-500 text-5xl mb-4">×</div>
        )}
        <h1 className="text-2xl font-bold mb-4">{message}</h1>
        <p className="text-gray-600">Bạn sẽ được chuyển hướng tự động...</p>
      </div>
    </div>
  );
};

export default PaymentResult;
