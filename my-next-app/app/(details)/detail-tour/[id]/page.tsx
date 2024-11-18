'use client';
import React from 'react';
import Image from 'next/image';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import StarRateIcon from '@mui/icons-material/StarRate';

interface Tour {
  tour_id: number;
  tour_name: string;
  description: string;
  duration: string;
  price_range: string;
  max_participants: number;
  location_id: number;
  tour_type_id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

interface TourSchedule {
  schedule_id: number;
  tour_id: number;
  start_date: Date;
  end_date: Date;
  available_slot: number;
  base_price: number;
}

const TourInfo = ({ tour }: { tour: Tour }) => {
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
          <div>Giá: {tour.price_range}</div>
          <div className="text-sm">Chọn ngày xuất phát: 30/10/2024</div>
        </div>

        <button className="w-full bg-black py-2 rounded">ĐẶT TOUR</button>
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

const BookingTable = ({ 
  schedules, 

}: { 
  schedules: TourSchedule[], 

}) => {
  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-pink-600  text-white dark:text-dark-text">
            <th className="border px-4 py-2 text-left">Bắt đầu</th>
            <th className="border px-4 py-2 text-left">Kết thúc</th> 
            <th className="border px-4 py-2 text-left">Số lượng trống</th>
            <th className="border px-4 py-2 text-left">Giá</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{schedule.start_date.toLocaleDateString()}</td>
              <td className="border px-4 py-2">{schedule.end_date.toLocaleDateString()}</td>
              <td className="border px-4 py-2">
                {schedule.available_slot}
              </td>
              <td className="border px-4 py-2">{schedule.base_price.toLocaleString()} đ</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TourDetailPage = () => {
    const tourData: Tour = {
      tour_id: 123,
      tour_name: "DU LỊCH BÀ RỊA - VŨNG TÀU",
      description: "Tour du lịch Vũng Tàu mang đến cho du khách những trải nghiệm tuyệt vời với bãi biển xanh mát và khí hậu dễ chịu. Bạn sẽ được tham quan các địa danh nổi tiếng như Tượng Chúa dang tay, ngọn hải đăng cổ kính, và bãi Sau yên bình. Ngoài ra, du khách cũng có thể thưởng thức những món hải sản tươi ngon tại các nhà hàng ven biển. Với các hoạt động như tắm biển, tham quan danh lam thắng cảnh và thưởng thức ẩm thực địa phương, Vũng Tàu hứa hẹn là điểm đến lý tưởng cho những ai muốn thư giãn và khám phá vẻ đẹp tự nhiên của vùng đất này.",
      duration: "2 ngày",
      price_range: "4.000.000 đ",
      max_participants: 30,
      location_id: 1,
      tour_type_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    };

  const schedules: TourSchedule[] = [
    {
      schedule_id: 1,
      tour_id: 123,
      start_date: new Date('2024-11-01'),
      end_date: new Date('2024-11-02'),
      available_slot: 20,
      base_price: 4000000,
    },
    // Các lịch trình khác
  ];

  return (
    <div className="min-h-screen !bg-white dark:!bg-dark-sidebar text-gray-700 dark:text-dark-text">
      <div className="!bg-white dark:!bg-dark-sidebar shadow-sm">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center"></div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-center mb-8">
          <h1 className="text-3xl text-pink-600 font-bold text-center">{tourData.tour_name}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="relative h-[300px] mb-6">
              <Image
                src="/br-vt.png"
                alt="Vũng Tàu View"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            
            <TourDescription description={tourData.description} />
            
            <div className="mt-6 space-y-4">
              <details className="!bg-white dark:!bg-dark-sidebar p-4 rounded-lg">
                <summary className="font-bold flex cursor-pointer list-none text-pink-600"><CalendarMonthIcon />LỊCH</summary>
                <BookingTable 
                  schedules={schedules}
                />
              </details>

              <details className="!bg-white dark:!bg-dark-sidebar p-4 rounded-lg">
                <summary className="font-bold flex cursor-pointer list-none text-pink-600"><BeenhereIcon/>LỊCH TRÌNH</summary>
                <div className="mt-4">
                  <p className="text-sm">Itinerary details...</p>
                </div>
              </details>  
              
              <details className="!bg-white dark:!bg-dark-sidebar p-4 rounded-lg">
                <summary className="font-bold flex cursor-pointer list-none text-pink-600"><StarRateIcon className=" h-full w-full align-middle"/>ĐÁNH GIÁ</summary>
                <div className="mt-4">
                  <p className="text-sm">No reviews yet.</p>
                </div>
              </details>
            </div>
            
          </div>
          
          <div>
            <TourInfo tour={tourData} />
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default TourDetailPage;