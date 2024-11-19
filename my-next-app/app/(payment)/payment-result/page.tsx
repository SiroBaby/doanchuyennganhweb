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
        const pendingBooking = JSON.parse(localStorage.getItem('pendingBooking') || '{}');

        if (!pendingBooking.user_id) {
          throw new Error('No pending booking found');
        }

        let paymentStatus;
        switch (vnp_ResponseCode) {
          case '00':
            paymentStatus = 'COMPLETED';
            setStatus('success');

            // Create booking only after successful payment
            const bookingResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...pendingBooking,
                booking_status: 'CONFIRMED',
                payment_status: paymentStatus
              })
            });

            if (!bookingResponse.ok) {
              throw new Error('Failed to create booking');
            }

            const booking = await bookingResponse.json();

            // Create invoice after successful booking
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/invoices`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                booking_id: booking.booking_id,
                user_id: pendingBooking.user_id,
                amount: pendingBooking.total_price,
                payment_status: paymentStatus
              })
            });
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

        setTimeout(() => {
          router.push('/');
        }, 3000);

      } catch (error) {
        console.error('Error processing payment:', error);
        setMessage('Có lỗi xảy ra khi xử lý thanh toán');
        setStatus('error');
        localStorage.removeItem('pendingBooking');
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
