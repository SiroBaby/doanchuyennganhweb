'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const PaymentResult = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState('Đang xử lý kết quả thanh toán...');
  const [status, setStatus] = useState<'success' | 'error' | 'loading'>('loading');
  const [isProcessing, setIsProcessing] = useState(false); // Thêm flag để track trạng thái xử lý

  useEffect(() => {
    const updatePaymentStatus = async () => {
      // Kiểm tra nếu đang xử lý thì return
      if (isProcessing) return;
      setIsProcessing(true);

      try {
        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
        const pendingBooking = JSON.parse(localStorage.getItem('pendingBooking') || '{}');
        console.log('Payment response code:', vnp_ResponseCode); // Debug log
        console.log('Pending booking data:', pendingBooking); // Debug log

        if (!pendingBooking.user_id) {
          throw new Error('No pending booking found');
        }

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

        // Clear stored booking data
        localStorage.removeItem('pendingBooking');

        setMessage(
          paymentStatus === 'COMPLETED'
            ? 'Thanh toán thành công! Đang chuyển hướng...'
            : paymentStatus === 'CANCELLED'
            ? 'Bạn đã hủy thanh toán'
            : 'Thanh toán thất bại!'
        );

        // Chỉ redirect khi thanh toán thành công
        if (paymentStatus === 'COMPLETED') {
          setTimeout(() => {
            router.push('/');
          }, 3000);
        }

      } catch (error) {
        console.error('Detailed error in payment processing:', error); // Enhanced error logging
        setMessage('Có lỗi xảy ra khi xử lý thanh toán');
        setStatus('error');
        localStorage.removeItem('pendingBooking');
      }
    };

    updatePaymentStatus();
  }, []); // Chỉ chạy một lần khi component mount

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
