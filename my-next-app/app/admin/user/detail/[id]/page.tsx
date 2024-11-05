'use client';
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Box,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useGetUserByIdQuery } from '@/app/store/api/userapi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';


const UserDetailPage = () => {
  const router = useRouter();
  const param = useParams();
  const userId = String(param.id);

  const { data: user, error, isLoading } = useGetUserByIdQuery(`"${userId}"`)
  console.log("data trả về ", user)

  if (isLoading) return <CircularProgress />

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
                <strong>UserID:</strong> {user?.user_id}
              </Typography>
              <Typography className="!text-gray-600 dark:!text-gray-300">
                <strong>Tên người dùng:</strong> {user?.full_name}
              </Typography>
              <Typography className="!text-gray-600 dark:!text-gray-300">
                <strong>Email:</strong> {user?.email}
              </Typography>
              <Typography className="!text-gray-600 dark:!text-gray-300">
                  <strong>Được tạo vào lúc:</strong> {user?.created_at}
              </Typography>
              <Typography className="!text-gray-600 dark:!text-gray-300">
                <strong>Được cập nhật vào lúc:</strong> {user?.updated_at} {/* Cần lưu ý khi hiển thị mật khẩu */}
              </Typography>
              <Typography className="!text-gray-600 dark:!text-gray-300">
                <strong>Được phân quyền:</strong> {user?.role_id === null ? 0 : user?.role_id} {/* Cần lưu ý khi hiển thị mật khẩu */}
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
