'use client'
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { useGetOrderDetailsQuery } from '@/app/store/api/orderapi';
import { useParams } from 'next/navigation';

const OrderDetailPage = () => {
  const params = useParams();
  const orderId = Number(params.id);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const { data: orderDetails, isLoading, error } = useGetOrderDetailsQuery(orderId);

  if (isLoading) return <Box p={3}><CircularProgress /></Box>;
  if (error) return <Box p={3}>Error loading order details</Box>;
  if (!orderDetails) return <Box p={3}>No order found</Box>;

  // Map API data to your form structure
  const invoiceData = {
    invoice_id: orderDetails.Invoices[0]?.invoice_id,
    booking_id: orderDetails.booking_id,
    user_id: orderDetails.User.user_id,
    user_name: orderDetails.User.full_name,
    user_email: orderDetails.User.email,
    amount: orderDetails.Invoices[0]?.amount || 0,
    date: orderDetails.Invoices[0]?.date,
    booking: {
      booking_date: new Date(orderDetails.booking_date).toLocaleDateString(),
      number_of_people: orderDetails.number_of_people,
      total_price: orderDetails.total_price,
      booking_status: orderDetails.booking_status,
      payment_status: orderDetails.payment_status,
      tour: {
        name: orderDetails.TourSchedule.Tour.tour_name,
        location: orderDetails.TourSchedule.Tour.Location.location_name,
        duration: orderDetails.TourSchedule.Tour.duration
      },
      vehicle: {
        code: orderDetails.VehicleAssignment?.Vehicle.vehicle_code,
        type: orderDetails.VehicleAssignment?.Vehicle.vehicle_type
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-dark-body min-h-screen">
      <Card className="!bg-white dark:!bg-dark-sidebar shadow-lg">
        <CardContent>
          <Typography variant="h4" component="h1" className="!font-bold !text-gray-800 dark:!text-gray-200 mb-4 flex items-center">
            <ReceiptIcon className="mr-2" /> Chi tiết hóa đơn #{invoiceData.invoice_id}
          </Typography>

          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Box>
              <Typography variant="h6" className="!text-gray-700 dark:!text-gray-300 flex items-center">
                <PersonIcon className="mr-2" /> Thông tin khách hàng
              </Typography>
              <Typography className="!text-gray-600 dark:!text-gray-400">Tên: {invoiceData.user_name}</Typography>
              <Typography className="!text-gray-600 dark:!text-gray-400">Email: {invoiceData.user_email}</Typography>
              <Typography className="!text-gray-600 dark:!text-gray-400">Thông tin ghi danh: {invoiceData.booking.booking_status}</Typography>
            </Box>
            <Box>
              <Typography variant="h6" className="!text-gray-700 dark:!text-gray-300 flex items-center">
                <EventIcon className="mr-2" /> Thông tin đặt tour
              </Typography>
              <Typography className="!text-gray-600 dark:!text-gray-400">Mã đặt tour: {invoiceData.booking_id}</Typography>
              <Typography className="!text-gray-600 dark:!text-gray-400">Ngày đặt: {new Date(invoiceData.booking.booking_date).toLocaleDateString()}</Typography>
              <Typography className="!text-gray-600 dark:!text-gray-400">Trạng thái: {invoiceData.booking.payment_status}</Typography>
            </Box>
          </Box>

          <Box className="mb-6">
            <Typography variant="h6" className="!text-gray-700 dark:!text-gray-300 mb-2">Chi tiết Tour</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200">Tour</TableCell>
                    <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200">Thời gian</TableCell>
                    <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200">Địa điểm</TableCell>
                    <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200">Số người</TableCell>
                    <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200">Giá</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell className="!text-gray-600 dark:!text-gray-400">{invoiceData.booking.tour.name}</TableCell>
                    <TableCell className="!text-gray-600 dark:!text-gray-400">{invoiceData.booking.tour.duration}</TableCell>
                    <TableCell className="!text-gray-600 dark:!text-gray-400">{invoiceData.booking.tour.location}</TableCell>
                    <TableCell className="!text-gray-600 dark:!text-gray-400">{invoiceData.booking.number_of_people}</TableCell>
                    <TableCell className="!text-gray-600 dark:!text-gray-400">{formatCurrency(invoiceData.amount)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box className="mb-6">
            <Typography variant="h6" className="!text-gray-700 dark:!text-gray-300 mb-2 flex items-center">
              <DirectionsBusIcon className="mr-2" /> Ngày khởi hành và Phương tiện
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200">Ngày bắt đầu</TableCell>
                    <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200">Ngày kết thúc</TableCell>
                    <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200">Phương tiện</TableCell>
                    <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200">Mã phương tiện</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell className="!text-gray-600 dark:!text-gray-400">
                      {new Date(orderDetails.TourSchedule.start_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="!text-gray-600 dark:!text-gray-400">
                      {new Date(orderDetails.TourSchedule.end_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="!text-gray-600 dark:!text-gray-400">
                      {orderDetails.VehicleAssignment.Vehicle.vehicle_type}
                    </TableCell>
                    <TableCell className="!text-gray-600 dark:!text-gray-400">
                      {orderDetails.VehicleAssignment.Vehicle.vehicle_code}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box className="flex justify-between items-center">
            <Typography variant="h6" className="!text-gray-700 dark:!text-gray-300 flex items-center">
              <AttachMoneyIcon className="mr-2" /> Tổng cộng: {formatCurrency(invoiceData.amount)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetailPage;