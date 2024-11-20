'use client';
import React from 'react';
import {
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useGetBookingsQuery } from '@/app/store/api/tourapi';
import { useRouter } from 'next/navigation';

const OrderPage = () => {
  const { data: bookings = [], isLoading, error } = useGetBookingsQuery();
  const router = useRouter();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleViewDetail = (bookingId: number) => {
    router.push(`/admin/order/detail/${bookingId}`);
  };

  if (isLoading) return <CircularProgress />;
  if (error) {
    return (
      <Typography color="error">
        Có lỗi xảy ra khi tải dữ liệu
      </Typography>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-gray-100 dark:bg-dark-body">
      <div className="h-screen p-6">
        <Card className="!bg-white dark:!bg-dark-sidebar shadow-lg h-full flex flex-col">
          <CardContent className="!p-0 flex flex-col h-full">
            <TableContainer 
              component={Paper} 
              className="!bg-transparent flex-grow overflow-hidden flex flex-col"
            >
              <div className="flex-grow overflow-auto">
                <Table stickyHeader className="min-w-full">
                  <TableHead>
                    <TableRow>
                      <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200 !bg-gray-50 dark:!bg-dark-sidebar !text-2xl">
                        Mã đơn
                      </TableCell>
                      <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200 !bg-gray-50 dark:!bg-dark-sidebar !text-2xl">
                        Khách hàng
                      </TableCell>
                      <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200 !bg-gray-50 dark:!bg-dark-sidebar !text-2xl">
                        Tour
                      </TableCell>
                      <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200 !bg-gray-50 dark:!bg-dark-sidebar !text-2xl">
                        Số người
                      </TableCell>
                      <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200 !bg-gray-50 dark:!bg-dark-sidebar !text-2xl">
                        Tổng tiền
                      </TableCell>
                      <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200 !bg-gray-50 dark:!bg-dark-sidebar !text-2xl">
                        Trạng thái
                      </TableCell>
                      <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200 !bg-gray-50 dark:!bg-dark-sidebar !text-2xl">
                        Thao tác
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bookings?.map((booking) => (
                      <TableRow 
                        key={booking.booking_id}
                        className="hover:!bg-gray-50 dark:hover:!bg-dark-selected transition-colors duration-150"
                      >
                        <TableCell className="!text-gray-600 dark:!text-gray-300 !text-xl">
                          {booking.booking_id}
                        </TableCell>
                        <TableCell className="!text-gray-600 dark:!text-gray-300 !text-xl">
                          {booking.User.full_name}
                        </TableCell>
                        <TableCell className="!text-gray-600 dark:!text-gray-300 !text-xl">
                          {booking.TourSchedule.Tour.tour_name}
                        </TableCell>
                        <TableCell className="!text-gray-600 dark:!text-gray-300 !text-xl">
                          {booking.number_of_people}
                        </TableCell>
                        <TableCell className="!text-gray-600 dark:!text-gray-300 !text-xl">
                          {formatCurrency(Number(booking.total_price))}
                        </TableCell>
                        <TableCell className="!text-gray-600 dark:!text-gray-300 !text-xl">
                          <Chip 
                            label={booking.payment_status}
                            color={getStatusColor(booking.payment_status)}
                          />
                        </TableCell>
                        <TableCell>
                            <IconButton 
                              onClick={() => handleViewDetail(booking.booking_id)}
                              className="!text-blue-500 hover:!bg-blue-50 dark:hover:!bg-blue-900"
                              size="small"
                            >
                              <EditIcon className="!w-7 !h-6" />
                            </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TableContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderPage;