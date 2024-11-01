'use client';
import React from 'react';
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
  IconButton,
  CircularProgress // Import CircularProgress for loading state
} from '@mui/material';
import { useRouter } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useGetVehiclesQuery } from '@/app/store/api/vehicleapi';

const VehiclesPage = () => {
  const router = useRouter();
  const { data: vehicles = [], error, isLoading } = useGetVehiclesQuery();
  
  // const handleEdit = (id: number) => {
  //   router.push(`/admin/vehicle/edit/${id}`);
  // };

  // const handleDelete = async (id: number) => {
  //   if (window.confirm('Bạn có chắc chắn muốn xóa phương tiện này?')) {
  //     try {
  //       // Uncomment and implement the actual API call
  //       // await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
  //       alert('Phương tiện đã được xóa thành công!'); // For feedback
  //     } catch (error) {
  //       alert('Có lỗi xảy ra khi xóa phương tiện.'); // For error feedback
  //     }
  //   }
  // };

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

  if (isLoading) return <CircularProgress />; // Show loading spinner
  if (error) {
    const errorMessage = 'Có lỗi xảy ra khi tải dữ liệu.';
    if ('status' in error) {
      const fetchError = error as FetchBaseQueryError;
      return (
        <Typography color="error">
          {errorMessage} Mã lỗi: {fetchError.status}
        </Typography>
      );
    }
    return (
      <Typography color="error">
        {errorMessage} Chi tiết: {error.message || 'Không có thông tin chi tiết.'}
      </Typography>
    );
  }

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
                <TableRow>
                  <TableCell className='dark:!text-dark-text'>Mã Phương tiện</TableCell>
                  <TableCell className='dark:!text-dark-text'>Loại</TableCell>
                  <TableCell className='dark:!text-dark-text'>Sức chứa tối đa</TableCell>
                  <TableCell className='dark:!text-dark-text'>Trạng thái</TableCell>
                  <TableCell className='dark:!text-dark-text'>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.vehicle_code}>
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
                          // onClick={() => handleEdit(vehicle.vehicle_id)} // Pass the vehicle ID
                        >
                          <EditIcon className="!w-7 !h-6" />
                        </IconButton>
                        <IconButton 
                          className="!text-red-500 hover:!bg-red-50 dark:hover:!bg-red-900"
                          size="small"
                          // onClick={() => handleDelete(vehicle.vehicle_id)} // Call handleDelete with vehicle ID
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
