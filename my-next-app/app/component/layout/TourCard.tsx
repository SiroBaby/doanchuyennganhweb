import { useGetSchedulesByTourIdQuery, useGetTourByIdQuery } from '@/app/store/api/tourapi';
import { IconButton } from '@mui/material';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
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
  imageUrl: string;
  countdownTime: string;
  code: string;
  departureCity: string;
  departureDate: string;
  seatsAvailable: number;
  originalPrice: number;
  discountedPrice: number;
}

const CardContainer = styled.div`
  width: 100%;
  max-width: 300px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  font-family: Arial, sans-serif;
  margin: 0 5px 10px 5px;
`;

const ImageContainer = styled.div`
  position: relative;
  height: 200px;
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

const OriginalPrice = styled.span`
  font-size: 14px;
  text-decoration: line-through;
  color: #999;
`;

const DiscountedPrice = styled.span`
  font-size: 19px;
  color: red;
  font-weight: bold;
`;

const TourDetail: React.FC = () => {
  const params = useParams();
  const tourId = Number(params.id);

  const { data: tour, isLoading, error } = useGetTourByIdQuery(tourId);
  const { data: schedules = [] } = useGetSchedulesByTourIdQuery(tourId);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error || !tour) {
    return <p>Error loading tour details.</p>;
  }

  return (
    <TourCard tour={tour} />
  );
};

const TourCard: React.FC<{ tour: Tour }> = ({ tour }) => {
  const router = useRouter();

  return (
    <CardContainer>
      <ImageContainer>
        <Image
          src={tour.imageUrl}
          alt={tour.tour_name}
          layout="fill"
          objectFit="cover"
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
            <br />
            <DiscountedPrice>{tour.discountedPrice.toLocaleString()} đ</DiscountedPrice>
          </div>
          {/* cái này để test thui nha */}
          <IconButton onClick={() => router.push(`/admin/tour/edit/${tour.tour_id}`)}> 
            Chi tiết
          </IconButton>
        </PriceContainer>
      </ContentContainer>
    </CardContainer>
  );
};

export default TourDetail;