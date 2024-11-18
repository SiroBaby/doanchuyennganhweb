import React, { useState } from 'react';
import styled from 'styled-components';
import SelectCountry from './Autocomplete'; // Đảm bảo đường dẫn đúng với vị trí file

const Container = styled.div`
  display: flex;
  align-items: center;
  background-color: #eaeaea;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
`;

const InputContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-right: 12px;

  label {
    font-weight: 500;
    margin-bottom: 5px;
    color: #555;
  }

  input {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px;
    font-size: 14px;
    transition: border-color 0.3s;

    &:focus {
      border-color: #ff8c42;
      outline: none;
    }
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 45px;
  background-color: #bbb;
  margin: 0 12px;
`;

const SearchButton = styled.button`
  background-color: #ff8c42;
  color: white;
  font-weight: bold;
  font-size: 16px;
  border: none;
  padding: 10px 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: #e57d38;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const SearchForm: React.FC = () => {
  const [month, setMonth] = useState('');
  const [price, setPrice] = useState('');
  
  const handleSearch = () => {
    console.log({
      month,
      price,
    });
  };

  return (
    <Container>
      <InputContainer>
        <label>Địa điểm:</label>
        <SelectCountry />
      </InputContainer>

      <Divider />

      <InputContainer>
        <label>Theo tháng:</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </InputContainer>

      <Divider />

      <InputContainer>
        <label>Giá cả:</label>
        <input
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
