'use client';
import React, { useState } from 'react';
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
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { SelectChangeEvent } from '@mui/material/Select';

type Vehicle = {
    code: string;
    type: string;
    maxCapacity: number;
    availableSeats: number;
    status: 'ready' | 'busy';
};

type Schedule = {
    startDate: string;
    endDate: string;
    basePrice: string;
    status: string;
    vehicle: string;
};

const defaultVehicles = [
  { code: 'VN123', type: 'Xe khách', status: 'ready' },
  { code: 'VN124', type: 'Xe giường nằm', status: 'ready' },
];

const defaultLocations = [
  { id: 1, name: 'Hà Nội' },
  { id: 2, name: 'Đà Nẵng' },
];

const AddTourPage = () => {
  const router = useRouter();

  const [tourName, setTourName] = useState('');
  const [duration, setDuration] = useState<number | ''>('');
  const [schedules, setSchedules] = useState([
    { startDate: '', endDate: '', basePrice: '', status: '', vehicle: '' },
  ]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleScheduleChange = (index: number, field: keyof Schedule, value: string) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value;
    setSchedules(newSchedules);
  };

  const addSchedule = () => {
    setSchedules([
      ...schedules,
      { startDate: '', endDate: '', basePrice: '', status: '', vehicle: '' },
    ]);
  };

  const handleLocationChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setSelectedLocations(value);
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

    if (!duration) {
      alert('Vui lòng chọn số ngày cho tour');
      return;
    }

    for (const schedule of schedules) {
      const startDate = new Date(schedule.startDate);
      const endDate = new Date(schedule.endDate);
      const scheduleDays = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1
      );

      if (scheduleDays !== duration) {
        alert(
          `Lịch trình ${schedule.startDate} - ${schedule.endDate} không hợp lệ. Tour yêu cầu ${duration} ngày.`
        );
        return;
      }
    }

    const formData = new FormData();
    formData.append('tour_name', tourName);
    formData.append('duration', duration.toString());
    selectedLocations.forEach((location) => formData.append('locations[]', location));
    imageFiles.forEach((file) => formData.append('images', file));

    schedules.forEach((schedule, index) => {
      formData.append(`schedules[${index}][startDate]`, schedule.startDate);
      formData.append(`schedules[${index}][endDate]`, schedule.endDate);
      formData.append(`schedules[${index}][basePrice]`, schedule.basePrice);
      formData.append(`schedules[${index}][status]`, schedule.status);
      formData.append(`schedules[${index}][vehicle]`, schedule.vehicle);
    });

    // Uncomment and replace with your endpoint
    // const response = await fetch('/api/tours', {
    //   method: 'POST',
    //   body: formData,
    // });

    router.push('/admin/tours');
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-dark-body">
      <Card className="!bg-white dark:!bg-dark-sidebar shadow-lg w-full max-w-2xl">
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
            <FormControl variant="outlined" required>
              <InputLabel>Thời gian (ngày)</InputLabel>
              <Select
                value={duration.toString()}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                label="Thời gian (ngày)"
              >
                {Array.from(Array(15).keys()).map((day) => (
                  <MenuItem key={day + 1} value={day + 1}>
                    {day + 1} ngày
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl variant="outlined" required>
              <InputLabel>Địa điểm</InputLabel>
              <Select
                multiple
                value={selectedLocations}
                onChange={handleLocationChange}
                label="Địa điểm"
              >
                {defaultLocations.map((location) => (
                  <MenuItem key={location.id} value={location.name}>
                    {location.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              required
            />
            <Typography variant="body2" className="text-gray-600">
              Chọn hình ảnh (có thể chọn nhiều hình)
            </Typography>

            <div className="flex flex-wrap">
              {imageFiles.map((file, index) => (
                <Paper key={index} className="flex items-center justify-between p-2 m-1">
                  <Typography variant="body2">{file.name}</Typography>
                  <Button onClick={() => handleRemoveImage(index)} color="secondary">
                    Xóa
                  </Button>
                </Paper>
              ))}
            </div>

            {schedules.map((schedule, index) => (
              <Paper key={index} className="p-4 mb-2">
                <Typography variant="h6" className="mb-2">Lịch Trình {index + 1}</Typography>
                <TextField
                  label="Ngày Bắt Đầu"
                  type="date"
                  variant="outlined"
                  value={schedule.startDate}
                  onChange={(e) => handleScheduleChange(index, 'startDate', e.target.value)}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  label="Ngày Kết Thúc"
                  type="date"
                  variant="outlined"
                  value={schedule.endDate}
                  onChange={(e) => handleScheduleChange(index, 'endDate', e.target.value)}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  label="Giá Cơ Bản"
                  variant="outlined"
                  value={schedule.basePrice}
                  onChange={(e) => handleScheduleChange(index, 'basePrice', e.target.value)}
                  required
                />
                <FormControl variant="outlined" required>
                  <InputLabel>Trạng Thái</InputLabel>
                  <Select
                    value={schedule.status}
                    onChange={(e) => handleScheduleChange(index, 'status', e.target.value)}
                    label="Trạng Thái"
                  >
                    <MenuItem value="Sẵn sàng">Sẵn sàng</MenuItem>
                    <MenuItem value="Đã hết chỗ">Đã hết chỗ</MenuItem>
                  </Select>
                </FormControl>
                <FormControl variant="outlined" required>
                  <InputLabel>Xe</InputLabel>
                  <Select
                    value={schedule.vehicle}
                    onChange={(e) => handleScheduleChange(index, 'vehicle', e.target.value)}
                    label="Xe"
                  >
                    {defaultVehicles
                      .filter(vehicle => vehicle.status === 'ready')
                      .map((vehicle) => (
                        <MenuItem key={vehicle.code} value={vehicle.code}>
                          {vehicle.type} - {vehicle.code}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Paper>
            ))}

            <Button variant="outlined" onClick={addSchedule}>
              Thêm Lịch Trình
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="self-center"
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
