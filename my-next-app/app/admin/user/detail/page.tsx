'use client';
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { useRouter } from 'next/navigation';

const UserDetailPage = () => {
  const router = useRouter();

  // Sample user data (this would be replaced by actual data from the backend)
  const user = {
    id: 1,
    name: 'Trà Vinh',
    email: 'travinh@example.com',
    password: '123456',
    phone: '0123456789',
    address: '123 Đường ABC, TP.HCM',
  };

  return (
    <div className="h-screen overflow-y-auto bg-gray-100 dark:bg-dark-body">
      <div className="p-6">
        <Card className="!bg-white dark:!bg-dark-sidebar shadow-lg">
          <CardContent>
            <Typography variant="h4" className="!text-gray-700 dark:!text-gray-200 !font-bold">
              User detail
            </Typography>
            <Box 
              display="flex" 
              flexDirection="column" 
              gap={2} // Thay thế cho spacing
              className="mt-4"
            >
              <Typography className="!text-gray-600 dark:!text-gray-300">
                <strong>UserID:</strong> {user.id}
              </Typography>
              <Typography className="!text-gray-600 dark:!text-gray-300">
                <strong>Tên người dùng:</strong> {user.name}
              </Typography>
              <Typography className="!text-gray-600 dark:!text-gray-300">
                <strong>Email:</strong> {user.email}
              </Typography>
              <Typography className="!text-gray-600 dark:!text-gray-300">
                <strong>Số điện thoại:</strong> {user.phone}
              </Typography>
              <Typography className="!text-gray-600 dark:!text-gray-300">
                <strong>Địa chỉ:</strong> {user.address}
              </Typography>
              <Typography className="!text-gray-600 dark:!text-gray-300">
                <strong>Mật khẩu:</strong> {user.password} {/* Cần lưu ý khi hiển thị mật khẩu */}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              className="mt-4"
              onClick={() => router.push('/admin/user')} // Quay lại trang danh sách người dùng
            >
              Quay lại
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDetailPage;
