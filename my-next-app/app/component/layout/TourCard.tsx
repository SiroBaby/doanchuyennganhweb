import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// Định nghĩa interface Tour
interface Tour {
  tour_id: number;
  tour_name: string;
  description?: string;
  duration?: string;
  price_range?: string;
  max_participants: number;
  location_id: number;
  tour_type_id: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  imageUrl: string; // Đảm bảo API của bạn trả về thuộc tính này
  countdownTime: string;
  code: string;
  departureCity: string;
  departureDate: string;
  seatsAvailable: number;
  originalPrice: number;
  discountedPrice: number;
}

const CardContainer = styled.div`
  width: 300px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  font-family: Arial, sans-serif;
`;

const ImageContainer = styled.div`
  position: relative;
`;

const HeartIcon = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 24px;
  color: white;
`;

const Countdown = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 4px;
  padding: 4px 8px;
  color: red;
  font-weight: bold;
`;

const ContentContainer = styled.div`
  padding: 16px;
`;

const TourTitle = styled.h2`
  font-size: 18px;
  color: #333;
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

const OriginalPrice = styled.span`
  font-size: 14px;
  text-decoration: line-through;
  color: #999;
`;

const DiscountedPrice = styled.span`
  font-size: 20px;
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

const TourCard: React.FC = () => {
  const [tour, setTour] = useState<Tour | null>(null);

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const response = await axios.get<Tour>('https://api.example.com/tours/1'); // URL của API
        setTour(response.data);
      } catch (error) {
        console.error('Error fetching tour data', error);
      }
    };

    fetchTourData();
  }, []);

  if (!tour) {
    return <div>Loading...</div>;
  }

  return (
    <CardContainer>
      <ImageContainer>
        <img
          src={tour.imageUrl}
          alt={tour.tour_name}
          width="100%"
          height="auto"
        />
        <HeartIcon>❤️</HeartIcon>
        <Countdown>{tour.countdownTime}</Countdown>
      </ImageContainer>
      <ContentContainer>
        <TourTitle>{tour.tour_name}</TourTitle>
        <InfoText>
          <span>Mã tour:</span> {tour.code}
        </InfoText>
        <InfoText>
          <span>Khởi hành:</span> {tour.departureCity}
        </InfoText>
        <InfoText>
          <span>Ngày khởi hành:</span> {tour.departureDate}
        </InfoText>
        <InfoText>
          <span>Thời gian:</span> {tour.duration}
        </InfoText>
        <InfoText>
          <span>Số chỗ còn nhận:</span> {tour.seatsAvailable}
        </InfoText>
        <PriceContainer>
          <div>
            <OriginalPrice>{tour.originalPrice.toLocaleString()} đ</OriginalPrice>
            <DiscountedPrice>{tour.discountedPrice.toLocaleString()} đ</DiscountedPrice>
          </div>
          <Button>Đặt ngay</Button>
        </PriceContainer>
      </ContentContainer>
    </CardContainer>
  );
};

export default TourCard;
