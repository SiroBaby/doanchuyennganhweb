import React, { useState } from 'react';
import styled from 'styled-components';
import {
  TourImage,
  TourListResponse,
  TourSchedule,
  useGetToursQuery
} from '../../store/api/tourapi';

const Container = styled.div`
  display: flex;
  align-items: center;
  background-color: #d3d3d3;
  padding: 10px;
  border-radius: 5px;
  font-family: Arial, sans-serif;
`;

const InputContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-right: 10px;
`;

const Label = styled.label`
  font-weight: bold;
  font-size: 16px;
  color: black;
`;

const Input = styled.input`
  border: none;
  background-color: transparent;
  font-size: 14px;
  color: black;
  outline: none;
  padding: 4px 0;
`;

const Divider = styled.div`
  width: 1px;
  height: 50px;
  background-color: #999;
  margin: 0 10px;
`;

const SearchButton = styled.button`
  background-color: #ff8c42;
  color: white;
  font-weight: bold;
  font-size: 18px;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e57d38;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ResultsContainer = styled.div`
  margin-top: 20px;
`;

const ResultCard = styled.div`
  background-color: white;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ResultTitle = styled.h3`
  margin: 0 0 10px 0;
  color: #333;
  font-size: 18px;
`;

const ResultInfo = styled.p`
  margin: 5px 0;
  color: #666;
  font-size: 14px;
`;

const ErrorMessage = styled.div`
  color: #ff0000;
  margin-top: 10px;
  padding: 10px;
  background-color: #ffe6e6;
  border-radius: 5px;
  text-align: center;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #666;
  margin-top: 10px;
`;

const ImageContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
  overflow-x: auto;
`;

const TourImageStyled = styled.img`
  width: 150px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
`;

const ScheduleContainer = styled.div`
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 5px;
`;

const ScheduleTitle = styled.h4`
  margin: 0 0 10px 0;
  color: #333;
`;

const ScheduleInfo = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 5px;
`;

interface SearchFormState {
  location: string;
  month: string;
  price: string;
}

const SearchForm: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchFormState>({
    location: '',
    month: '',
    price: ''
  });
  const [filteredResults, setFilteredResults] = useState<TourListResponse[]>([]);
  const [error, setError] = useState<string>('');

  const { data: tours, isLoading, isError } = useGetToursQuery();

  const validateInputs = (): boolean => {
    if (!searchParams.location && !searchParams.month && !searchParams.price) {
      setError('Vui lòng nhập ít nhất một điều kiện tìm kiếm');
      return false;
    }
    return true;
  };

  const formatPrice = (price: string): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(parseInt(price));
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getScheduleStatus = (status: TourSchedule['status']): string => {
    const statusMap: Record<TourSchedule['status'], string> = {
      'ACTIVE': 'Đang mở',
      'CANCELLED': 'Đã hủy',
      'COMPLETED': 'Đã hoàn thành',
      'FULL': 'Hết chỗ'
    };
    return statusMap[status];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (): void => {
    if (!validateInputs()) return;
    setError('');

    if (tours) {
      const filtered = tours.filter(tour => {
        const locationMatch = !searchParams.location || 
          tour.Location.city.toLowerCase().includes(searchParams.location.toLowerCase()) ||
          tour.Location.country.toLowerCase().includes(searchParams.location.toLowerCase());
        
        const priceMatch = !searchParams.price || 
          (tour.price_range && parseInt(tour.price_range) <= parseInt(searchParams.price));
        
        let monthMatch = true;
        if (searchParams.month) {
          const searchMonth = new Date(searchParams.month).getMonth();
          monthMatch = tour.TourSchedules?.some(schedule => {
            const scheduleMonth = new Date(schedule.start_date).getMonth();
            return scheduleMonth === searchMonth;
          }) || false;
        }

        return locationMatch && priceMatch && monthMatch;
      });

      setFilteredResults(filtered);
    }
  };

  return (
    <div>
      <Container>
        <InputContainer>
          <Label>Địa điểm:</Label>
          <Input
            type="text"
            name="location"
            value={searchParams.location}
            onChange={handleInputChange}
            placeholder="Nhập thành phố hoặc quốc gia"
          />
        </InputContainer>

        <Divider />

        <InputContainer>
          <Label>Theo tháng:</Label>
          <Input
            type="month"
            name="month"
            value={searchParams.month}
            onChange={handleInputChange}
          />
        </InputContainer>

        <Divider />

        <InputContainer>
          <Label>Giá tối đa:</Label>
          <Input
            type="number"
            name="price"
            value={searchParams.price}
            onChange={handleInputChange}
            placeholder="Nhập giá tối đa"
          />
        </InputContainer>

        <SearchButton onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Đang tải...' : 'Tìm kiếm'}
        </SearchButton>
      </Container>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {isError && <ErrorMessage>Có lỗi xảy ra khi tải dữ liệu</ErrorMessage>}

      <ResultsContainer>
        {isLoading ? (
          <LoadingMessage>Đang tải dữ liệu...</LoadingMessage>
        ) : filteredResults.length > 0 ? (
          filteredResults.map((tour) => (
            <ResultCard key={tour.tour_id}>
              <ResultTitle>{tour.tour_name}</ResultTitle>
              <ResultInfo>Địa điểm: {tour.Location.city}, {tour.Location.country}</ResultInfo>
              <ResultInfo>Loại tour: {tour.TourType.type_name}</ResultInfo>
              <ResultInfo>Thời gian: {tour.duration}</ResultInfo>
              <ResultInfo>Giá: {tour.price_range ? formatPrice(tour.price_range) : 'Liên hệ'}</ResultInfo>
              {tour.description && (
                <ResultInfo>Mô tả: {tour.description}</ResultInfo>
              )}
              
              {tour.TourImages && tour.TourImages.length > 0 && (
                <ImageContainer>
                  {tour.TourImages.map((image: TourImage) => (
                    <TourImageStyled 
                      key={image.image_id} 
                      src={image.image_url} 
                      alt={tour.tour_name}
                    />
                  ))}
                </ImageContainer>
              )}

              {tour.TourSchedules && tour.TourSchedules.length > 0 && (
                <ScheduleContainer>
                  <ScheduleTitle>Lịch trình sắp tới:</ScheduleTitle>
                  {tour.TourSchedules.map((schedule) => (
                    <ScheduleInfo key={schedule.schedule_id}>
                      <span>
                        {formatDate(schedule.start_date)} - {formatDate(schedule.end_date)}
                      </span>
                      <span>Giá: {formatPrice(schedule.base_price.toString())}</span>
                      <span>Còn {schedule.available_slots} chỗ</span>
                      <span>Trạng thái: {getScheduleStatus(schedule.status)}</span>
                    </ScheduleInfo>
                  ))}
                </ScheduleContainer>
              )}
            </ResultCard>
          ))
        ) : (
          <LoadingMessage>Không tìm thấy kết quả phù hợp</LoadingMessage>
        )}
      </ResultsContainer>
    </div>
  );
};

export default SearchForm;