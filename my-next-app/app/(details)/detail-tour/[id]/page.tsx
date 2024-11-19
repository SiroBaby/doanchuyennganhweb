'use client';
import React, { useState } from 'react';
import { useGetTourByIdQuery, useGetSchedulesByTourIdQuery, TourSchedule } from '@/app/store/api/tourapi';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import StarRateIcon from '@mui/icons-material/StarRate';
import { Rating } from '@mui/material';
import { useAuth } from "@clerk/nextjs";

interface Tour {
  tour_id: number;
  tour_name: string;
  description: string | null;  // Change this to allow null
  duration: string | null;     // Change this to allow null
  price_range: string | null;  // Change this to allow null
  max_participants: number;
  location_id: number;
  tour_type_id: number;
  created_at: string;         // Change from Date to string
  updated_at: string;         // Change from Date to string
  deleted_at?: string | null; // Change from Date to string|null
  Reviews?: Review[];
}

interface Review {
  review_id: number;
  user_id: string;
  rating: number;
  comment: string;
  review_date: string;
  User: {
    full_name: string;
  };
}

const TourInfo = ({ tour, schedules }: { tour: Tour; schedules: TourSchedule[] }) => {
  const router = useRouter();
  const { userId, isLoaded } = useAuth();
  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);

  const handleBooking = () => {
    if (!selectedSchedule) {
      alert('Vui lòng chọn ngày khởi hành');
      return;
    }
    router.push(`/payment?tourId=${tour.tour_id}&scheduleId=${selectedSchedule}`);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  return (
    <div className="flex flex-col w-[300px] h-min-screen sticky top-4 z-50">
      <div className="bg-gray-100 rounded-lg p-4 mb-4">
        <div className="border-b pb-2 mb-2">
          <div className="text-pink-600 font-bold text-sm mb-1">{tour.tour_name}</div>
        </div>
        
        <div className="border-b pb-2 mb-2">  
          <div className="text-gray-600 text-sm mb-1">Mã tour: {tour.tour_id}</div>
        </div>

        <div className="border-b pb-2">
          <div className="text-gray-600 text-sm mb-1">Thời gian: {tour.duration}</div> 
        </div>
      </div>

      <div className="bg-pink-600 text-white rounded-lg p-4">
        <div className="mb-4">
          <div className="mt-4">
            <label className="block mb-2 text-sm font-bold">Chọn ngày khởi hành:</label>
            <select 
              className="w-full p-2 text-gray-700 bg-white rounded"
              value={selectedSchedule || ''}
              onChange={(e) => setSelectedSchedule(Number(e.target.value))}
            >
              <option value="">-- Chọn ngày --</option>
              {schedules
                .filter(schedule => schedule.status === 'ACTIVE' && schedule.available_slots > 0)
                .map(schedule => (
                  <option key={schedule.schedule_id} value={schedule.schedule_id}>
                    {formatDate(schedule.start_date)} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(schedule.base_price))}
                    {' '}({schedule.available_slots} chỗ trống)
                  </option>
                ))}
            </select>
          </div>
        </div>

        <button 
          onClick={handleBooking}
          className="w-full bg-black py-2 rounded hover:bg-gray-800 transition-colors disabled:bg-gray-500"
          disabled={!selectedSchedule || !userId || !isLoaded}
        >
          ĐẶT TOUR
        </button>
      </div>
    </div>
  );
};

const TourDescription = ({ description }: { description: string }) => {
  return (
    <div className="tour-description mt-4">
      <h3 className="font-medium mb-2">Tour Description:</h3>
      <p className="text-gray-700 dark:text-dark-text text-sm">{description}</p>
    </div>
  );
};

const BookingTable = ({ schedules }: { schedules: TourSchedule[] }) => {
  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-pink-600 text-white dark:text-dark-text">
            <th className="border px-4 py-2 text-left">Bắt đầu</th>
            <th className="border px-4 py-2 text-left">Kết thúc</th> 
            <th className="border px-4 py-2 text-left">Số lượng trống</th>
            <th className="border px-4 py-2 text-left">Giá</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <tr key={schedule.schedule_id}>
              <td className="border px-4 py-2">
                {new Date(schedule.start_date).toLocaleDateString('vi-VN')}
              </td>
              <td className="border px-4 py-2">
                {new Date(schedule.end_date).toLocaleDateString('vi-VN')}
              </td>
              <td className="border px-4 py-2">
                {schedule.available_slots}
              </td>
              <td className="border px-4 py-2">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(schedule.base_price)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ReviewSection = ({ tourId, reviews = [] }: { tourId: number; reviews: Review[] }) => {
  const { userId, isLoaded } = useAuth();
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !isLoaded) {
      alert('Vui lòng đăng nhập để đánh giá');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tour_id: tourId,
          user_id: userId,
          rating,
          comment,
        }),
      });

      if (response.ok) {
        setComment('');
        setRating(5);
        // Refresh the page to show new review
        window.location.reload();
      } else {
        throw new Error('Failed to submit review');
      }
    } catch {
      alert('Có lỗi xảy ra khi gửi đánh giá');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      {userId && isLoaded && (
        <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-white rounded-lg shadow">
          <h3 className="font-bold mb-4">Viết đánh giá</h3>
          <div className="mb-4">
            <Rating
              value={rating}
              onChange={(_, newValue) => {
                setRating(newValue || 5);
              }}
              precision={0.5}
            />
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Nhập đánh giá của bạn"
            rows={4}
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.review_id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold">{review.User.full_name}</span>
                <Rating value={review.rating} readOnly size="small" />
              </div>
              <p className="text-gray-600">{review.comment}</p>
              <p className="text-sm text-gray-400 mt-2">
                {new Date(review.review_date).toLocaleDateString('vi-VN')}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">Chưa có đánh giá nào.</p>
        )}
      </div>
    </div>
  );
};

const TourDetailPage = () => {
  const params = useParams();
  const tourId = Number(params.id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { data: tour, isLoading: tourLoading } = useGetTourByIdQuery(tourId);
  const { data: schedules = [], isLoading: schedulesLoading } = useGetSchedulesByTourIdQuery(tourId);

  if (tourLoading || schedulesLoading) {
    return <div>Loading...</div>;
  }

  if (!tour) {
    return <div>Tour not found</div>;
  }

  const images = tour.TourImages || [];
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Add type assertion here
  const tourData = tour as unknown as Tour;

  return (
    <div className="min-h-screen !bg-white dark:!bg-dark-sidebar text-gray-700 dark:text-dark-text">
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-center mb-8">
          <h1 className="text-3xl text-pink-600 font-bold text-center">{tour.tour_name}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="relative h-[300px] mb-6">
              <div className="absolute inset-0">
                <Image
                  src={images[currentImageIndex]?.image_url || '/placeholder.jpg'}
                  alt={tour.tour_name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg transition-opacity duration-500"
                />
              </div>
              {images.length > 1 && (
                <>
                  <button
                    onClick={previousImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75"
                  >
                    →
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <TourDescription description={tour.description || ''} />
            
            <div className="mt-6 space-y-4">
              <details className="!bg-white dark:!bg-dark-sidebar p-4 rounded-lg">
                <summary className="font-bold flex cursor-pointer list-none text-pink-600">
                  <CalendarMonthIcon />LỊCH
                </summary>
                <BookingTable schedules={schedules} />
              </details>  
              
              <details className="!bg-white dark:!bg-dark-sidebar p-4 rounded-lg">
                <summary className="font-bold flex cursor-pointer list-none text-pink-600"><StarRateIcon/>ĐÁNH GIÁ</summary>
                <ReviewSection tourId={tour.tour_id} reviews={tour.Reviews || []} />
              </details>
            </div>
            
          </div>
          
          <div>
            <TourInfo tour={tourData} schedules={schedules} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TourDetailPage;