import React, { useState } from 'react';
import styled from 'styled-components';

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
`;

const SearchForm: React.FC = () => {
  const [location, setLocation] = useState('Viet Nam');
  const [month, setMonth] = useState('');
  const [price, setPrice] = useState('');

  const handleSearch = () => {
    console.log({
      location,
      month,
      price,
    });
  };

  return (
    <Container>
      <InputContainer>
        <Label>Địa điểm:</Label>
        <Input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Nhập địa điểm"
        />
      </InputContainer>

      <Divider />

      <InputContainer>
        <Label>Theo tháng:</Label>
        <Input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </InputContainer>

      <Divider />

      <InputContainer>
        <Label>Giá cả:</Label>
        <Input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Nhập giá"
        />
      </InputContainer>

      <SearchButton onClick={handleSearch}>Tìm kiếm</SearchButton>
    </Container>
  );
};

export default SearchForm;
