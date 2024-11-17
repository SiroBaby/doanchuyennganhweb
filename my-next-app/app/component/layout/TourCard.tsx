import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';

// Types
interface Location {
  location_id: number;
  location_name: string;
  country: string;
  city: string;
}

interface Tour {
  tour_id: number;
  tour_name: string;
  description: string | null;
  duration: string | null;
  price_range: string | null;
  max_participants: number;
  location_id: number;
  Location: Location; // Add Location relation
  TourImages: TourImage[]; // Add TourImages relation
}

interface TourImage {
  image_id: number;
  tour_id: number;
  image_url: string;
}

// Component
const CardContainer = styled.div`
  width: 100%;
  max-width: 300px; /* Điều chỉnh max-width để thẻ có kích thước tối đa */
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  font-family: Arial, sans-serif;
  margin: 0 5px 10px 5px; /* Thêm khoảng cách giữa các thẻ */
`;

const ImageContainer = styled.div`
  position: relative;
  height: 200px; /* Đặt chiều cao cố định cho ảnh */
`;

const HeartIcon = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 24px;
  color: white;
`;

// const Countdown = styled.div`
//   position: absolute;
//   bottom: 10px;
//   right: 10px;
//   display: flex;
//   align-items: center;
//   background-color: #fff;
//   border-radius: 4px;
//   padding: 4px 8px;
//   color: red;
//   font-weight: bold;
// `;

const ContentContainer = styled.div`
  padding: 16px;
`;

const TourTitle = styled.h2`
  font-size: 18px;
  color: #333;
  margin: 0;
`;

const InfoText = styled.p`
  font-size: 14px;
  color: #666;
  margin: 4px 0;
  display: flex;
  align-items: center;

  & span {
    font-weight: bold;
    color: #007bff;
  }
`;

const PriceContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;

// const OriginalPrice = styled.span`
//   font-size: 14px;
//   text-decoration: line-through;
//   color: #999;
// `;

const DiscountedPrice = styled.span`
  font-size: 19px;
  color: red;
  font-weight: bold;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const TourCard: React.FC<{ tour: Tour }> = ({ tour }) => {
  const defaultImage = '/default-tour.jpg';
  
  const getImageUrl = () => {
    if (!tour.TourImages?.[0]?.image_url) {
      return defaultImage;
    }
    try {
      const imageUrl = tour.TourImages[0].image_url;
      return `http://localhost:4000/${imageUrl.replace(/^\//, '')}`;
    } catch (error) {
      console.error('Error processing image URL:', error);
      return defaultImage;
    }
  };

  return (
    <CardContainer>
      <ImageContainer>
        <Image
          src={getImageUrl()}
          alt={tour.tour_name}
          layout="fill"
          objectFit="cover"
          onError={(e) => {
            e.currentTarget.src = defaultImage;
          }}
        />
        <HeartIcon>❤️</HeartIcon>
      </ImageContainer>
      <ContentContainer>
        <TourTitle>{tour.tour_name}</TourTitle>
        <InfoText>
          <span>Mã tour: </span> {tour.tour_id}
        </InfoText>
        <InfoText>
          <span>Khởi hành: </span> {tour.Location?.city}, {tour.Location?.country}
        </InfoText>
        <InfoText>
          <span>Thời gian: </span> {tour.duration || 'Chưa cập nhật'}
        </InfoText>
        <PriceContainer>
          <div>
            <DiscountedPrice>
              {tour.price_range ? `${tour.price_range.toLocaleString()} VND` : 'Liên hệ'}
            </DiscountedPrice>
          </div>
          <Button>Đặt ngay</Button>
        </PriceContainer>
      </ContentContainer>
    </CardContainer>
  );
};

export default TourCard;
