'use client';
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useRouter, useParams } from 'next/navigation';
import { SelectChangeEvent } from '@mui/material/Select';
import Image from 'next/image';
import { useGetTourByIdQuery, useUpdateTourMutation, useGetLocationsQuery, useGetTourTypesQuery, useAddScheduleMutation, useGetAvailableVehiclesQuery, useUpdateScheduleMutation, TourSchedule, useGetSchedulesByTourIdQuery } from '@/app/store/api/tourapi';

interface Schedule {
  schedule_id?: number;
  start_date: string;
  end_date: string;
  base_price: number;
  available_slots: number;
  status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED' | 'FULL';
  vehicle_id?: string;
}

const EditTourPage = () => {
  const router = useRouter();
  const params = useParams();
  const tourId = Number(params.id);

  const { data: tour, isLoading } = useGetTourByIdQuery(tourId);
  const [updateTour] = useUpdateTourMutation();
  const { data: locations = [] } = useGetLocationsQuery();
  const { data: tourTypes = [] } = useGetTourTypesQuery();
  const [addSchedule] = useAddScheduleMutation();
  const { data: availableVehicles = [] } = useGetAvailableVehiclesQuery();
  const [updateSchedule] = useUpdateScheduleMutation();
  const { data: schedules = [] } = useGetSchedulesByTourIdQuery(tourId);

  // Form state
  const [formData, setFormData] = useState({
    tour_name: '',
    description: '',
    duration: '',
    price_range: '',
    max_participants: 0,
    location_id: '',  // Change to string to match Select component requirements
    tour_type_id: '', // Change to string to match Select component requirements
  });

  // Image management
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Schedule management - rename to newSchedules to avoid conflict
  const [newSchedules, setNewSchedules] = useState<Schedule[]>([{
    start_date: '',
    end_date: '',
    base_price: 0,
    available_slots: 0,
    status: 'ACTIVE',
    vehicle_id: '',
  }]);

  const [existingSchedules, setExistingSchedules] = useState<TourSchedule[]>([]);

  useEffect(() => {
    if (tour) {
      setFormData({
        tour_name: tour.tour_name,
        description: tour.description || '',
        duration: tour.duration || '',
        price_range: tour.price_range || '',
        max_participants: tour.max_participants,
        location_id: tour.location_id.toString(), // Convert to string
        tour_type_id: tour.tour_type_id.toString(), // Convert to string
      });
      setExistingSchedules(tour.TourSchedules || []); // Add null check
    }
  }, [tour]);

  useEffect(() => {
    if (schedules.length > 0) {
      setExistingSchedules(schedules);
    }
  }, [schedules]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setNewImages(prev => [...prev, ...filesArray]);
    }
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (imageId: number) => {
    setImagesToDelete(prev => [...prev, imageId]);
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const response = await fetch('http://localhost:4000/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.imageUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let newImageUrls: string[] = [];
      if (newImages.length > 0) {
        newImageUrls = await uploadImages(newImages);
      }

      await updateTour({
        tour_id: tourId,
        ...formData,
        // Convert string IDs back to numbers for API call
        location_id: Number(formData.location_id),
        tour_type_id: Number(formData.tour_type_id),
        images: newImageUrls,
        images_to_delete: imagesToDelete,
      }).unwrap();

      router.push(`/admin/tour/detail/${tourId}`);
    } catch (error) {
      console.error('Error updating tour:', error);
      alert('Failed to update tour');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNewSchedule = () => {
    const newSchedule: Schedule = {
      start_date: '',
      end_date: '',
      base_price: 0,
      available_slots: 0,
      status: 'ACTIVE',
      vehicle_id: '',
    };
    setNewSchedules(prev => [...prev, newSchedule]);
  };

  const handleSaveSchedules = async () => {
    try {
      // Validate schedules before saving
      for (const schedule of newSchedules) {
        await addSchedule({
          tourId,
          schedule: {
            ...schedule,
            base_price: Number(schedule.base_price),
            available_slots: Number(schedule.available_slots),
            vehicle_id: schedule.vehicle_id ? Number(schedule.vehicle_id) : undefined,
          }
        }).unwrap();
      }
      // Clear schedules after successful save
      setNewSchedules([]);
    } catch (error) {
      console.error('Error saving schedules:', error);
      alert('Không thể lưu lịch trình. Vui lòng thử lại.');
    }
  };

  const validateDateDuration = (startDate: string, endDate: string, expectedDuration: number): boolean => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === expectedDuration;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0, // Prevent decimal places
    }).format(amount);
  };


  const validateStartDate = (startDate: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part to compare dates only
    const inputDate = new Date(startDate);
    return inputDate >= today;
  };

  const handleScheduleChange = (index: number, field: keyof Schedule, value: string | number) => {
    setNewSchedules(prevSchedules => {
      const newSchedules = [...prevSchedules];
      const currentSchedule = { ...newSchedules[index] };

      if (field === 'start_date') {
        if (!validateStartDate(value.toString())) {
          alert('Ngày bắt đầu không được trước ngày hiện tại!');
          return prevSchedules;
        }

        const endDate = currentSchedule.end_date;
        if (endDate && value) {
          const isValidDuration = validateDateDuration(
            value.toString(),
            endDate,
            Number(formData.duration)
          );

          if (!isValidDuration) {
            alert(`Thời gian tour phải đúng ${formData.duration} ngày!`);
            return prevSchedules;
          }
        }
      }

      if (field === 'end_date') {
        const startDate = currentSchedule.start_date;
        if (startDate && value) {
          const isValidDuration = validateDateDuration(
            startDate,
            value.toString(),
            Number(formData.duration)
          );

          if (!isValidDuration) {
            alert(`Thời gian tour phải đúng ${formData.duration} ngày!`);
            return prevSchedules;
          }
        }
      }

      if (field === 'base_price') {
        currentSchedule[field] = Number(value);
      } else {
        currentSchedule[field as keyof Schedule] = value as never;
      }

      newSchedules[index] = currentSchedule;
      return newSchedules;
    });
  };

  const handleExistingScheduleChange = (scheduleId: number, field: keyof TourSchedule, value: string | number) => {
    setExistingSchedules(prev => prev.map(schedule => {
      if (schedule.schedule_id === scheduleId) {
        if (field === 'start_date') {
          if (!validateStartDate(value.toString())) {
            alert('Ngày bắt đầu không được trước ngày hiện tại!');
            return schedule;
          }

          const isValidDuration = validateDateDuration(
            value.toString(),
            schedule.end_date,
            Number(formData.duration)
          );

          if (!isValidDuration) {
            alert(`Thời gian tour phải đúng ${formData.duration} ngày!`);
            return schedule;
          }
        }

        if (field === 'end_date') {
          const isValidDuration = validateDateDuration(
            schedule.start_date,
            value.toString(),
            Number(formData.duration)
          );

          if (!isValidDuration) {
            alert(`Thời gian tour phải đúng ${formData.duration} ngày!`);
            return schedule;
          }
        }

        // Remove validation for available_slots
        if (field === 'vehicle_id') {
          return {
            ...schedule,
            VehicleAssignments: value ? [{
              vehicle_id: Number(value),
              Vehicle: availableVehicles.find(v => v.vehicle_id === Number(value))!
            }] : []
          };
        }

        // Fix the type error by explicitly handling different field types
        if (field === 'base_price' || field === 'available_slots') {
          return {
            ...schedule,
            [field]: Number(value)
          };
        }

        if (field === 'status') {
          return {
            ...schedule,
            status: value as TourSchedule['status']
          };
        }

        return {
          ...schedule,
          [field]: value
        };
      }
      return schedule;
    }));
  };

  const handleUpdateExistingSchedule = async (schedule: TourSchedule) => {
    try {
      await updateSchedule({
        schedule_id: schedule.schedule_id,
        start_date: schedule.start_date,
        end_date: schedule.end_date,
        base_price: Number(schedule.base_price),
        available_slots: Number(schedule.available_slots),
        status: schedule.status,
        vehicle_id: schedule.VehicleAssignments?.[0]?.vehicle_id
      }).unwrap();
      alert('Cập nhật lịch trình thành công');
    } catch (error) {
      console.error('Error updating schedule:', error);
      alert('Không thể cập nhật lịch trình');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Card>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom>
            Chỉnh sửa Tour
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tên Tour"
                  name="tour_name"
                  value={formData.tour_name}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Mô tả"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Thời gian (ngày)"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Khoảng giá"
                  name="price_range"
                  value={formData.price_range}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Số người tối đa"
                  name="max_participants"
                  type="number"
                  value={formData.max_participants}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Địa điểm</InputLabel>
                  <Select
                    name="location_id"
                    value={formData.location_id}
                    onChange={handleChange}
                    label="Địa điểm"
                  >
                    {locations.map((location) => (
                      <MenuItem key={location.location_id} value={location.location_id}>
                        {location.location_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Loại Tour</InputLabel>
                  <Select
                    name="tour_type_id"
                    value={formData.tour_type_id}
                    onChange={handleChange}
                    label="Loại Tour"
                  >
                    {tourTypes.map((type) => (
                      <MenuItem key={type.type_id} value={type.type_id}>
                        {type.type_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Image Management */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Hình ảnh
                </Typography>
                
                {/* Existing Images */}
                <Box className="grid grid-cols-2 gap-4 mb-4">
                  {tour?.TourImages.filter(img => !imagesToDelete.includes(img.image_id)).map((image) => (
                    <Box key={image.image_id} className="relative">
                      <Image
                        src={`http://localhost:4000${image.image_url}`}
                        alt="Tour image"
                        width={200}
                        height={150}
                        className="rounded"
                      />
                      <IconButton
                        className="absolute top-0 right-0 bg-white"
                        onClick={() => handleRemoveExistingImage(image.image_id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Box>

                {/* New Images */}
                <Box>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    id="new-images"
                  />
                  <label htmlFor="new-images">
                    <Button variant="contained" component="span">
                      Thêm hình ảnh
                    </Button>
                  </label>

                  <Box className="grid grid-cols-2 gap-4 mt-4">
                    {newImages.map((file, index) => (
                      <Paper key={index} className="p-2">
                        <Typography variant="body2">{file.name}</Typography>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleRemoveNewImage(index)}
                        >
                          Xóa
                        </Button>
                      </Paper>
                    ))}
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Existing Schedules Management Section */}
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Lịch trình hiện tại
              </Typography>
              {existingSchedules?.length > 0 ? ( // Add null check and length check
                existingSchedules.map((schedule) => (
                  <Paper key={schedule.schedule_id} className="p-4 mb-4">
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Ngày bắt đầu"
                          type="date"
                          value={schedule.start_date.split('T')[0]}
                          onChange={(e) => handleExistingScheduleChange(schedule.schedule_id, 'start_date', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Ngày kết thúc"
                          type="date"
                          value={schedule.end_date.split('T')[0]}
                          onChange={(e) => handleExistingScheduleChange(schedule.schedule_id, 'end_date', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Giá cơ bản"
                          type="number"
                          value={schedule.base_price}
                          onChange={(e) => handleExistingScheduleChange(schedule.schedule_id, 'base_price', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Số chỗ"
                          type="number"
                          value={schedule.available_slots}
                          onChange={(e) => handleExistingScheduleChange(schedule.schedule_id, 'available_slots', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Trạng thái</InputLabel>
                          <Select
                            value={schedule.status}
                            onChange={(e) => handleExistingScheduleChange(schedule.schedule_id, 'status', e.target.value)}
                            label="Trạng thái"
                          >
                            <MenuItem value="ACTIVE">Hoạt động</MenuItem>
                            <MenuItem value="CANCELLED">Đã hủy</MenuItem>
                            <MenuItem value="COMPLETED">Đã hoàn thành</MenuItem>
                            <MenuItem value="FULL">Đã đầy</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Phương tiện</InputLabel>
                          <Select
                            value={schedule.VehicleAssignments?.[0]?.vehicle_id || ''}
                            onChange={(e) => handleExistingScheduleChange(schedule.schedule_id, 'vehicle_id', e.target.value)}
                            label="Phương tiện"
                          >
                            <MenuItem value="">Không chọn phương tiện</MenuItem>
                            {availableVehicles.map((vehicle) => (
                              <MenuItem key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                                {vehicle.vehicle_type} - {vehicle.vehicle_code} (Sức chứa: {vehicle.max_capacity})
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          onClick={() => handleUpdateExistingSchedule(schedule)}
                        >
                          Cập nhật lịch trình
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                ))
              ) : (
                <Typography color="textSecondary">
                  Chưa có lịch trình nào.
                </Typography>
              )}
            </Box>

            {/* Schedule Management Section */}
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Quản lý lịch trình
              </Typography>
              
              {newSchedules.map((schedule, index) => (
                <Paper key={index} className="p-4 mb-4">
                  <Box className="flex justify-between items-center mb-4">
                    <Typography variant="subtitle1">Lịch Trình {index + 1}</Typography>
                    <IconButton 
                      color="error" 
                      onClick={() => setNewSchedules(prev => prev.filter((_, i) => i !== index))}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Ngày Bắt Đầu"
                        type="date"
                        value={schedule.start_date}
                        onChange={(e) => handleScheduleChange(index, 'start_date', e.target.value)}
                        required
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Ngày Kết Thúc"
                        type="date"
                        value={schedule.end_date}
                        onChange={(e) => handleScheduleChange(index, 'end_date', e.target.value)}
                        required
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Giá Cơ Bản"
                        name={`base_price-${index}`}
                        type="number"
                        value={schedule.base_price}
                        onChange={(e) => handleScheduleChange(index, 'base_price', Number(e.target.value))}
                        required
                        InputProps={{
                          startAdornment: <span style={{ marginRight: 8 }}>₫</span>,
                        }}
                        helperText={formatCurrency(schedule.base_price)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Số Chỗ"
                        type="number"
                        value={schedule.available_slots}
                        onChange={(e) => handleScheduleChange(index, 'available_slots', Number(e.target.value))}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required>
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
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Phương Tiện</InputLabel>
                        <Select
                          value={schedule.vehicle_id || ''}
                          onChange={(e) => handleScheduleChange(index, 'vehicle_id', e.target.value)}
                          label="Phương Tiện"
                        >
                          <MenuItem value="">Không chọn phương tiện</MenuItem>
                          {availableVehicles.map((vehicle) => (
                            <MenuItem key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                              {vehicle.vehicle_type} - {vehicle.vehicle_code} (Sức chứa: {vehicle.max_capacity})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Paper>
              ))}

              <Box mt={2} display="flex" gap={2}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleAddNewSchedule}
                  startIcon={<AddIcon />}
                >
                  Thêm Lịch Trình
                </Button>
                {newSchedules.length > 0 && (
                  <Button 
                    variant="contained" 
                    color="secondary"
                    onClick={handleSaveSchedules}
                  >
                    Lưu Lịch Trình
                  </Button>
                )}
              </Box>
            </Box>

            <Box mt={3} display="flex" gap={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push(`/admin/tour/detail/${tourId}`)}
              >
                Hủy
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditTourPage;
