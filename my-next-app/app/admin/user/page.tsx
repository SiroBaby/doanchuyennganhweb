'use client'
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
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useGetUsersQuery } from '@/app/store/api/userapi';
import { useRouter } from 'next/navigation';

const UserPage = () => {

  const { data: users = [], error, isLoading } = useGetUsersQuery()
  const router = useRouter()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'DELETE':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleDetailUser = (id: string) => {
    router.push(`/admin/user/detail/${id}`)
  }

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
    <div className="h-screen overflow-y-auto bg-gray-100 dark:bg-dark-body">
      {/* Fixed height container for the table */}
      <div className="h-screen p-6">
        <Card className="!bg-white dark:!bg-dark-sidebar shadow-lg h-full flex flex-col">
          <CardContent className="!p-0 flex flex-col h-full">
            {/* Table with fixed header */}
            <TableContainer 
              component={Paper} 
              className="!bg-transparent flex-grow overflow-hidden flex flex-col"
            >
              <div className="flex-grow overflow-auto">
                <Table stickyHeader className="min-w-full">
                  <TableHead>
                    <TableRow>
                      <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200 !bg-gray-50 dark:!bg-dark-sidebar !text-2xl">
                        UserID
                      </TableCell>
                      <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200 !bg-gray-50 dark:!bg-dark-sidebar !text-2xl">
                        UserName
                      </TableCell>
                      <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200 !bg-gray-50 dark:!bg-dark-sidebar !text-2xl">
                        Email
                      </TableCell>
                      <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200 !bg-gray-50 dark:!bg-dark-sidebar !text-2xl">
                        Status
                      </TableCell>
                      <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200 !bg-gray-50 dark:!bg-dark-sidebar !text-2xl">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow 
                        key={user.user_id}
                        className="hover:!bg-gray-50 dark:hover:!bg-dark-selected transition-colors duration-150"
                      >
                        <TableCell className="!text-gray-600 dark:!text-gray-300 !text-xl">
                          {user.user_id}
                        </TableCell>
                        <TableCell className="!text-gray-600 dark:!text-gray-300 !text-xl">
                          {user.full_name}
                        </TableCell>
                        <TableCell className="!text-gray-600 dark:!text-gray-300 !text-xl">
                          {user.email}
                        </TableCell>
                        <TableCell className="!text-gray-600 dark:!text-gray-300 !text-xl">
                          <Chip 
                            label = {user.status}
                            color = {getStatusColor(user.status)}
                          />
                        </TableCell>
                        <TableCell>
                            <IconButton 
                              onClick={() => handleDetailUser(user.user_id)}
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

export default UserPage;