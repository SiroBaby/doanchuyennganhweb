'use client';
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  IconButton
} from '@mui/material';
import { useRouter } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Vehicle {
  vehicle_id: number;
  vehicle_code: string;
  vehicle_type: string;
  max_capacity: number;
  current_status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'RETIRED';
}

const VehiclesPage = () => {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      // Thay thế bằng API call thực tế
      // const response = await fetch('/api/vehicles');
      // const data = await response.json();
      // setVehicles(data);

      // Dữ liệu mẫu
      setVehicles([
        { vehicle_id: 1, vehicle_code: 'VN123', vehicle_type: 'Xe khách', max_capacity: 45, current_status: 'AVAILABLE' },
        { vehicle_id: 2, vehicle_code: 'VN124', vehicle_type: 'Xe giường nằm', max_capacity: 30, current_status: 'IN_USE' },
      ]);
    };

    fetchVehicles();
  }, []);

  const handleEdit = (id: number) => {
    router.push(`/admin/vehicles/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phương tiện này?')) {
      // Thay thế bằng API call thực tế
      // await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
      setVehicles(vehicles.filter(vehicle => vehicle.vehicle_id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'success';
      case 'IN_USE':
        return 'primary';
      case 'MAINTENANCE':
        return 'warning';
      case 'RETIRED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-dark-body min-h-screen">
      <Card className="mb-4">
        <CardContent className='bg-gray-100 dark:bg-dark-sidebar h-screen'>
          <Typography variant="h5" component="div" className="mb-4 dark:text-dark-text">
            Quản lý Phương tiện
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push('/admin/vehicle/add')}
            className="mb-4"
          >
            Thêm Phương tiện mới
          </Button>
          <TableContainer component={Paper} className='bg-gray-100 dark:bg-dark-body'>
            <Table>
              <TableHead>
                <TableRow >
                  <TableCell className='dark:!text-dark-text'>Mã Phương tiện</TableCell>
                  <TableCell className='dark:!text-dark-text'>Loại</TableCell>
                  <TableCell className='dark:!text-dark-text'>Sức chứa tối đa</TableCell>
                  <TableCell className='dark:!text-dark-text'>Trạng thái</TableCell>
                  <TableCell className='dark:!text-dark-text'>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.vehicle_id}>
                    <TableCell className='dark:!text-dark-text'>{vehicle.vehicle_code}</TableCell>
                    <TableCell className='dark:!text-dark-text'>{vehicle.vehicle_type}</TableCell>
                    <TableCell className='dark:!text-dark-text'>{vehicle.max_capacity}</TableCell>
                    <TableCell className='dark:!text-dark-text'>
                      <Chip 
                        label={vehicle.current_status} 
                        color={getStatusColor(vehicle.current_status) as "success" | "primary" | "warning" | "error" | "default"}
                      />
                    </TableCell>
                    <TableCell>
                    <div className="flex space-x-2">
                            <IconButton 
                              className="!text-blue-500 hover:!bg-blue-50 dark:hover:!bg-blue-900"
                              size="small"
                            >
                              <EditIcon className="!w-7 !h-6" />
                            </IconButton>
                            <IconButton 
                              className="!text-red-500 hover:!bg-red-50 dark:hover:!bg-red-900"
                              size="small"
                            >
                              <DeleteIcon className="!w-7 !h-6" />
                            </IconButton>
                          </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehiclesPage;