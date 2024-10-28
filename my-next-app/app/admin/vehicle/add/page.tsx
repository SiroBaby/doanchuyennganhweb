'use client';
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { SelectChangeEvent } from '@mui/material/Select';
import { useAddVehicleMutation } from '@/app/store/api/vehicleapi';

interface VehicleData {
  vehicle_code: string;
  vehicle_type: string;
  max_capacity: number;
  current_status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'RETIRED';
}

const AddVehiclePage = () => {
  const router = useRouter();
  const [addVehicle] = useAddVehicleMutation();
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    vehicle_code: '',
    vehicle_type: '',
    max_capacity: 0,
    current_status: 'AVAILABLE',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setVehicleData(prevData => ({
      ...prevData,
      [name]: name === 'max_capacity' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addVehicle({

        vehicle_code: vehicleData.vehicle_code,
        vehicle_type: vehicleData.vehicle_type,
        max_capacity: vehicleData.max_capacity,
        current_status: vehicleData.current_status,
      }).unwrap(); 
      router.push('/admin/vehicle');
    } catch (error) {
      console.error("Error adding vehicle:", error);
      // Xử lý lỗi hiển thị cho người dùng nếu cần
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent>
          <Typography variant="h5" component="div" className="mb-4">
            Thêm Phương tiện mới
          </Typography>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              fullWidth
              label="Mã Phương tiện"
              name="vehicle_code"
              value={vehicleData.vehicle_code}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Loại Phương tiện"
              name="vehicle_type"
              value={vehicleData.vehicle_type}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Sức chứa tối đa"
              name="max_capacity"
              type="number"
              value={vehicleData.max_capacity}
              onChange={handleChange}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                name="current_status"
                value={vehicleData.current_status}
                onChange={handleChange}
                required
              >
                <MenuItem value="AVAILABLE">Sẵn sàng</MenuItem>
                <MenuItem value="IN_USE">Đang sử dụng</MenuItem>
                <MenuItem value="MAINTENANCE">Bảo trì</MenuItem>
                <MenuItem value="RETIRED">Ngưng hoạt động</MenuItem>
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Thêm Phương tiện
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddVehiclePage;