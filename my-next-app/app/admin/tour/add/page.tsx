'use client';
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { SelectChangeEvent } from '@mui/material/Select';

interface Location {
  location_id: number;
  location_name: string;
  country: string;
  city: string;
}

interface TourType {
  type_id: number;
  type_name: string;
  description: string;
}

interface Vehicle {
  vehicle_id: number;
  vehicle_code: string;
  vehicle_type: string;
  max_capacity: number;
  current_status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'RETIRED';
}

interface Schedule {
  start_date: string;
  end_date: string;
  base_price: string;
  available_slots: string;
  status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED' | 'FULL';
  vehicle_id: number;
}

const AddTourPage = () => {
  const router = useRouter();

  const [tourName, setTourName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [maxParticipants, setMaxParticipants] = useState<number | ''>('');
  const [locationId, setLocationId] = useState<number | ''>('');
  const [tourTypeId, setTourTypeId] = useState<number | ''>('');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // State for dropdown options
  const [locations, setLocations] = useState<Location[]>([]);
  const [tourTypes, setTourTypes] = useState<TourType[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // Fetch dropdown options
  useEffect(() => {
    // Replace these with actual API calls
    const fetchLocations = async () => {
      // const response = await fetch('/api/locations');
      // const data = await response.json();
      // setLocations(data);
      setLocations([
        { location_id: 1, location_name: 'Hà Nội', country: 'Việt Nam', city: 'Hà Nội' },
        { location_id: 2, location_name: 'Đà Nẵng', country: 'Việt Nam', city: 'Đà Nẵng' },
      ]);
    };

    const fetchTourTypes = async () => {
      // const response = await fetch('/api/tour-types');
      // const data = await response.json();
      // setTourTypes(data);
      setTourTypes([
        { type_id: 1, type_name: 'Văn hóa', description: 'Tour văn hóa' },
        { type_id: 2, type_name: 'Ẩm thực', description: 'Tour ẩm thực' },
      ]);
    };

    const fetchVehicles = async () => {
      // const response = await fetch('/api/vehicles');
      // const data = await response.json();
      // setVehicles(data);
      setVehicles([
        { vehicle_id: 1, vehicle_code: 'VN123', vehicle_type: 'Xe khách', max_capacity: 45, current_status: 'AVAILABLE' },
        { vehicle_id: 2, vehicle_code: 'VN124', vehicle_type: 'Xe giường nằm', max_capacity: 30, current_status: 'AVAILABLE' },
      ]);
    };

    fetchLocations();
    fetchTourTypes();
    fetchVehicles();
  }, []);

  const handleScheduleChange = (index: number, field: keyof Schedule, value: string) => {
    const newSchedules = [...schedules];
    newSchedules[index] = { ...newSchedules[index], [field]: value };
    setSchedules(newSchedules);
  };

  const addSchedule = () => {
    setSchedules([
      ...schedules,
      { start_date: '', end_date: '', base_price: '', available_slots: '', status: 'ACTIVE', vehicle_id: 0 },
    ]);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setImageFiles((prevFiles) => [...prevFiles, ...filesArray]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const tourData = {
      tour_name: tourName,
      description,
      duration,
      price_range: priceRange,
      max_participants: maxParticipants,
      location_id: locationId,
      tour_type_id: tourTypeId,
      schedules,
    };

    // Here you would typically send the data to your API
    console.log(tourData);

    // Uncomment and replace with your API endpoint
    // try {
    //   const response = await fetch('/api/tours', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(tourData),
    //   });
    //   if (response.ok) {
    //     router.push('/admin/tours');
    //   } else {
    //     throw new Error('Failed to create tour');
    //   }
    // } catch (error) {
    //   console.error('Error creating tour:', error);
    // }

    // For now, just redirect
    router.push('/admin/tours');
  };

  return (
    <div className="h-screen overflow-auto py-6 bg-gray-100 dark:bg-dark-body">
      <Card className="!bg-white dark:!bg-dark-sidebar shadow-lg w-full max-w-4xl mx-auto">
        <CardContent>
          <Typography variant="h5" className="mb-4 text-center">
            Thêm Tour Mới
          </Typography>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <TextField
              label="Tên Tour"
              variant="outlined"
              value={tourName}
              onChange={(e) => setTourName(e.target.value)}
              required
            />
            <TextField
              label="Mô tả"
              variant="outlined"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <TextField
              label="Thời gian (ngày)"
              variant="outlined"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
            <TextField
              label="Khoảng giá"
              variant="outlined"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              required
            />
            <TextField
              label="Số người tối đa"
              variant="outlined"
              type="number"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
              required
            />
            <FormControl variant="outlined" required>
              <InputLabel>Địa điểm</InputLabel>
              <Select
                value={locationId}
                onChange={(e: SelectChangeEvent<number>) => setLocationId(e.target.value as number)}
                label="Địa điểm"
              >
                {locations.map((location) => (
                  <MenuItem key={location.location_id} value={location.location_id}>
                    {location.location_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" required>
              <InputLabel>Loại Tour</InputLabel>
              <Select
                value={tourTypeId}
                onChange={(e: SelectChangeEvent<number>) => setTourTypeId(e.target.value as number)}
                label="Loại Tour"
              >
                {tourTypes.map((type) => (
                  <MenuItem key={type.type_id} value={type.type_id}>
                    {type.type_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="h6" className="mt-4">Lịch Trình</Typography>
            {schedules.map((schedule, index) => (
              <Paper key={index} className="p-4 mb-2">
                <Typography variant="subtitle1" className="mb-2">Lịch Trình {index + 1}</Typography>
                <Box className="flex flex-wrap gap-4">
                  <TextField
                    label="Ngày Bắt Đầu"
                    type="date"
                    value={schedule.start_date}
                    onChange={(e) => handleScheduleChange(index, 'start_date', e.target.value)}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Ngày Kết Thúc"
                    type="date"
                    value={schedule.end_date}
                    onChange={(e) => handleScheduleChange(index, 'end_date', e.target.value)}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Giá Cơ Bản"
                    type="number"
                    value={schedule.base_price}
                    onChange={(e) => handleScheduleChange(index, 'base_price', e.target.value)}
                    required
                  />
                  <TextField
                    label="Số Chỗ"
                    type="number"
                    value={schedule.available_slots}
                    onChange={(e) => handleScheduleChange(index, 'available_slots', e.target.value)}
                    required
                  />
                  <FormControl variant="outlined" required>
                    <InputLabel>Trạng Thái</InputLabel>
                    <Select
                      value={schedule.status}
                      onChange={(e) => handleScheduleChange(index, 'status', e.target.value as Schedule['status'])}
                      label="Trạng Thái"
                    >
                      <MenuItem value="ACTIVE">Hoạt động</MenuItem>
                      <MenuItem value="CANCELLED">Đã hủy</MenuItem>
                      <MenuItem value="COMPLETED">Đã hoàn thành</MenuItem>
                      <MenuItem value="FULL">Đã đầy</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl variant="outlined" required>
                    <InputLabel>Phương Tiện</InputLabel>
                    <Select
                      value={schedule.vehicle_id}
                      onChange={(e) => handleScheduleChange(index, 'vehicle_id', e.target.value as unknown as string)}
                      label="Phương Tiện"
                    >
                      {vehicles.map((vehicle) => (
                        <MenuItem key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                          {vehicle.vehicle_type} - {vehicle.vehicle_code}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Paper>
            ))}

            <Button variant="outlined" onClick={addSchedule}>
              Thêm Lịch Trình
            </Button>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="mt-4"
            />
            <Typography variant="body2" className="text-gray-600">
              Chọn hình ảnh (có thể chọn nhiều hình)
            </Typography>

            <div className="flex flex-wrap gap-2 mt-2">
              {imageFiles.map((file, index) => (
                <Paper key={index} className="p-2 flex items-center">
                  <Typography variant="body2" className="mr-2">{file.name}</Typography>
                  <Button size="small" onClick={() => handleRemoveImage(index)} color="secondary">
                    Xóa
                  </Button>
                </Paper>
              ))}
            </div>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="self-center mt-6"
            >
              Lưu Tour
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTourPage;