import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  background-color: #d3d3d3;
  padding: 10px;
  border-radius: 20px;
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
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const handleSearch = () => {
    console.log({
      location,
      checkIn,
      checkOut,
      guests,
    });
  };

  return (
    <Container>
      <InputContainer>
        <Label>Location:</Label>
        <Input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
        />
      </InputContainer>

      <Divider />

      <InputContainer>
        <Label>Check In</Label>
        <Input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
        />
      </InputContainer>

      <Divider />

      <InputContainer>
        <Label>Check Out</Label>
        <Input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </InputContainer>

      <Divider />

      <InputContainer>
        <Label>Guests</Label>
        <Input
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value))}
        />
      </InputContainer>

      <SearchButton onClick={handleSearch}>Search</SearchButton>
    </Container>
  );
};

export default SearchForm;
