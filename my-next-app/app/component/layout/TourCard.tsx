import React from 'react';
import { useGetToursQuery } from '../../store/api/tourapi'; // Đảm bảo đường dẫn chính xác tới file `tourapi.ts`

const TourCard: React.FC = () => {
  // Gọi hook `useGetToursQuery` để lấy dữ liệu từ API
  const { data: tours, error, isLoading } = useGetToursQuery();

  // Kiểm tra trạng thái đang tải dữ liệu
  if (isLoading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  // Kiểm tra nếu có lỗi xảy ra khi gọi API
  if (error) {
    return <p>Có lỗi xảy ra khi tải dữ liệu tour.</p>;
  }

  // Hiển thị dữ liệu từ API
  return (
    <div>
      {tours && tours.length > 0 ? (
        tours.map((tour) => (
          <div key={tour.tour_id} className="card-container">
            <h2>{tour.tour_name}</h2>
            <p>{tour.description || 'Không có mô tả'}</p>
            <p>Thời gian: {tour.duration || 'Không xác định'}</p>
            <p>Khoảng giá: {tour.price_range || 'Không xác định'}</p>
            <p>Số người tối đa: {tour.max_participants}</p>
            {/* Thêm các chi tiết khác nếu cần */}
          </div>
        ))
      ) : (
        <p>Không có tour nào hiện có.</p>
      )}
    </div>
  );
};

export default TourCard;
