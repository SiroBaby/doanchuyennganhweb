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
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import PaymentIcon from '@mui/icons-material/Payment';

const OrderDetailPage = () => {
  // Sample invoice data with multiple values for certain attributes
  const invoiceData = {
    invoice_id: 1001,
    booking_id: 5001,
    user_id: 101,
    user_name: "Nguyễn Văn A",
    user_email: "nguyenvana@email.com",
    user_phone: "0123456789",
    amount: 15000000,
    date: "2024-10-15",
    booking: {
      booking_date: "2024-09-30",
      number_of_people: 3,
      total_price: 15000000,
      booking_status: "Confirmed",
      tour: {
        tour_id: 201,
        tour_name: "Du lịch Hà Nội - Hạ Long - Sapa",
        description: "Khám phá vẻ đẹp của miền Bắc Việt Nam",
        duration: "5 ngày 4 đêm",
        location: "Hà Nội, Hạ Long, Sapa",
        schedules: [
          {
            start_date: "2024-10-15",
            end_date: "2024-10-19",
            base_price: 5000000,
            status: "Confirmed",
            vehicle: {
              vehicle_code: "BUS001",
              vehicle_type: "Xe khách 45 chỗ",
              available_seats: 10
            }
          },
          {
            start_date: "2024-10-16",
            end_date: "2024-10-17",
            base_price: 2000000,
            status: "Confirmed",
            vehicle: {
              vehicle_code: "BOAT001",
              vehicle_type: "Tàu du lịch Hạ Long",
              available_seats: 30
            }
          },
          {
            start_date: "2024-10-18",
            end_date: "2024-10-19",
            base_price: 3000000,
            status: "Confirmed",
            vehicle: {
              vehicle_code: "TRAIN001",
              vehicle_type: "Tàu hỏa Hà Nội - Lào Cai",
              available_seats: 20
            }
          }
        ],
      }
    },
    payments: [
      {
        payment_id: 7001,
        amount: 5000000,
        payment_date: "2024-09-30",
        payment_method: "Credit Card"
      },
      {
        payment_id: 7002,
        amount: 5000000,
        payment_date: "2024-10-05",
        payment_method: "Bank Transfer"
      },
      {
        payment_id: 7003,
        amount: 5000000,
        payment_date: "2024-10-10",
        payment_method: "Cash"
      }
    ]
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
              <Typography className="!text-gray-600 dark:!text-gray-400">Số điện thoại: {invoiceData.user_phone}</Typography>
            </Box>
            <Box>
              <Typography variant="h6" className="!text-gray-700 dark:!text-gray-300 flex items-center">
                <EventIcon className="mr-2" /> Thông tin đặt tour
              </Typography>
              <Typography className="!text-gray-600 dark:!text-gray-400">Mã đặt tour: {invoiceData.booking_id}</Typography>
              <Typography className="!text-gray-600 dark:!text-gray-400">Ngày đặt: {new Date(invoiceData.booking.booking_date).toLocaleDateString()}</Typography>
              <Typography className="!text-gray-600 dark:!text-gray-400">Trạng thái: {invoiceData.booking.booking_status}</Typography>
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
                    <TableCell className="!text-gray-600 dark:!text-gray-400">{invoiceData.booking.tour.tour_name}</TableCell>
                    <TableCell className="!text-gray-600 dark:!text-gray-400">{invoiceData.booking.tour.duration}</TableCell>
                    <TableCell className="!text-gray-600 dark:!text-gray-400">{invoiceData.booking.tour.location}</TableCell>
                    <TableCell className="!text-gray-600 dark:!text-gray-400">{invoiceData.booking.number_of_people}</TableCell>
                    <TableCell className="!text-gray-600 dark:!text-gray-400">{invoiceData.amount.toLocaleString()} VND</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box className="mb-6">
            <Typography variant="h6" className="!text-gray-700 dark:!text-gray-300 mb-2 flex items-center">
              <DirectionsBusIcon className="mr-2" /> Lịch trình và Phương tiện
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200">Ngày bắt đầu</TableCell>
                    <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200">Ngày kết thúc</TableCell>
                    <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200">Phương tiện</TableCell>
                    <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200">Mã phương tiện</TableCell>
                    <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200">Chỗ trống</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoiceData.booking.tour.schedules.map((schedule, index) => (
                    <TableRow key={index}>
                      <TableCell className="!text-gray-600 dark:!text-gray-400">{schedule.start_date}</TableCell>
                      <TableCell className="!text-gray-600 dark:!text-gray-400">{schedule.end_date}</TableCell>
                      <TableCell className="!text-gray-600 dark:!text-gray-400">{schedule.vehicle.vehicle_type}</TableCell>
                      <TableCell className="!text-gray-600 dark:!text-gray-400">{schedule.vehicle.vehicle_code}</TableCell>
                      <TableCell className="!text-gray-600 dark:!text-gray-400">{schedule.vehicle.available_seats}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box className="mb-6">
            <Typography variant="h6" className="!text-gray-700 dark:!text-gray-300 mb-2 flex items-center">
              <PaymentIcon className="mr-2" /> Lịch sử thanh toán
            </Typography>
            <List>
              {invoiceData.payments.map((payment, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={`Thanh toán #${payment.payment_id}`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" className="!text-gray-600 dark:!text-gray-400">
                            Số tiền: {payment.amount.toLocaleString()} VND
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2" className="!text-gray-600 dark:!text-gray-400">
                            Ngày: {new Date(payment.payment_date).toLocaleDateString()}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2" className="!text-gray-600 dark:!text-gray-400">
                            Phương thức: {payment.payment_method}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < invoiceData.payments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>

          <Box className="flex justify-between items-center">
            <Typography variant="h6" className="!text-gray-700 dark:!text-gray-300 flex items-center">
              <AttachMoneyIcon className="mr-2" /> Tổng cộng: {invoiceData.amount.toLocaleString()} VND
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetailPage;