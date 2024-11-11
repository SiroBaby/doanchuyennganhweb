'use client';
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Paper,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { SelectChangeEvent } from '@mui/material/Select';
import { useGetLocationsQuery, useGetTourTypesQuery, type Location, type TourType, useAddTourMutation, type AddTourRequest } from '@/app/store/api/tourapi';

const AddTourPage = () => {
  const router = useRouter();
  const { data: locations = [] } = useGetLocationsQuery();
  const { data: tourTypes = [] } = useGetTourTypesQuery();
  const [addTour] = useAddTourMutation();

  const [tourName, setTourName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [maxParticipants, setMaxParticipants] = useState<number | ''>('');
  const [locationId, setLocationId] = useState<number | ''>('');
  const [tourTypeId, setTourTypeId] = useState<number | ''>('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setImageFiles((prevFiles) => [...prevFiles, ...filesArray]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch('https://doanchuyennganhweb.onrender.com/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.imageUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!tourName || !locationId || !tourTypeId || !maxParticipants || !duration || !priceRange) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setIsUploading(true);
      let imageUrls: string[] = [];
      
      if (imageFiles.length > 0) {
        imageUrls = await uploadImages(imageFiles);
      }

      const tourData: AddTourRequest = {
        tour_name: tourName.trim(),
        description: description.trim() || null,
        duration: duration.toString(),
        price_range: priceRange.trim(),
        max_participants: Number(maxParticipants),
        location_id: Number(locationId),
        tour_type_id: Number(tourTypeId),
        images: imageUrls,
      };

      await addTour(tourData).unwrap();
      router.push('/admin/tour');
    } catch (error) {
      console.error('Lỗi khi tạo tour:', error);
      alert('Không thể tạo tour. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
    }
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
              inputProps={{ min: 1 }}
              value={duration}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value > 0) setDuration(e.target.value);
              }}
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
              <InputLabel id="location-label">Địa điểm</InputLabel>
              <Select
                labelId="location-label"
                value={locationId}
                onChange={(e: SelectChangeEvent<number | ''>) => setLocationId(e.target.value as number)}
                label="Địa điểm"
              >
                {locations.map((location: Location) => (
                  <MenuItem key={location.location_id} value={location.location_id}>
                    {location.location_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" required>
              <InputLabel id="tourtype-label">Loại Tour</InputLabel>
              <Select
                labelId="tourtype-label"
                value={tourTypeId}
                onChange={(e: SelectChangeEvent<number | ''>) => setTourTypeId(e.target.value as number)}
                label="Loại Tour"
              >
                {tourTypes.map((type: TourType) => (
                  <MenuItem key={type.type_id} value={type.type_id}>
                    {type.type_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box className="mt-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="upload-images"
              />
              <label htmlFor="upload-images">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<i className="fas fa-upload" />}
                >
                  Chọn Hình Ảnh
                </Button>
              </label>
              <Typography variant="body2" className="text-gray-600 mt-2">
                Chọn hình ảnh (có thể chọn nhiều hình)
              </Typography>
            </Box>

            <div className="flex flex-wrap gap-2 mt-2">
              {imageFiles.map((file, index) => (
                <Paper key={index} className="p-2 flex items-center">
                  <Typography variant="body2" className="mr-2">{file.name}</Typography>
                  <Button size="small" onClick={() => handleRemoveImage(index)} color="error">
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
              disabled={isUploading}
            >
              {isUploading ? 'Đang tải...' : 'Lưu Tour'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTourPage;