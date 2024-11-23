'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

interface PaymentFormData {
  numberOfPeople: number;
  specialRequests: string;
  bankCode: string;
  language: string;
}

interface Schedule {
  schedule_id: number;
  base_price: number;
  available_slots: number;
  Tour: {
    tour_id: number;
    tour_name: string;
  };
}

const PaymentPage = () => {
  const { userId } = useAuth();
  const searchParams = useSearchParams();
  const scheduleId = searchParams.get('scheduleId');
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<PaymentFormData>({
    numberOfPeople: 1,
    specialRequests: '',
    bankCode: '',
    language: 'vn'
  });

  useEffect(() => {
    const fetchScheduleDetails = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/schedules/${scheduleId}`);
        const data = await response.json();
        setSchedule(data);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    if (scheduleId) {
      fetchScheduleDetails();
    }
  }, [scheduleId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !schedule) return;

    try {
      // Store pending booking data in localStorage
      const pendingBookingData = {
        user_id: userId,
        schedule_id: Number(scheduleId),
        number_of_people: formData.numberOfPeople,
        total_price: schedule.base_price * formData.numberOfPeople,
        special_requests: formData.specialRequests
      };
      localStorage.setItem('pendingBooking', JSON.stringify(pendingBookingData));

      // Create VNPay payment URL
      const paymentData = {
        orderId: `TOUR_${Date.now()}`,
        amount: pendingBookingData.total_price,
        orderInfo: `Thanh toan tour ${schedule.Tour.tour_name}`,
        bankCode: formData.bankCode,
        language: formData.language,
        ipAddr: '127.0.0.1',
        returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment-result`
      };

      const vnpayResponse = await fetch('/api/create-payment-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      if (!vnpayResponse.ok) {
        throw new Error('Failed to create payment URL');
      }

      const { paymentUrl } = await vnpayResponse.json();
      
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert(`Có lỗi xảy ra trong quá trình thanh toán: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!schedule) return <div>Schedule not found</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Thanh toán Tour</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Số lượng người</label>
          <input
            type="number"
            name="numberOfPeople"
            min="1"
            max={schedule.available_slots}
            value={formData.numberOfPeople}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Yêu cầu đặc biệt</label>
          <textarea
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>

        <div>
          <label className="block mb-2">Phương thức thanh toán:</label>
          <select 
            name="bankCode"
            value={formData.bankCode}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Chọn phương thức thanh toán</option>
            <option value="VNPAYQR">Thanh toán qua ứng dụng hỗ trợ VNPAYQR</option>
            <option value="VNBANK">Thanh toán qua ATM-Tài khoản ngân hàng nội địa</option>
          </select>
        </div>

        <div>
          <p className="font-bold">
            Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(schedule.base_price * formData.numberOfPeople)}
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
        >
          Thanh toán ngay
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
