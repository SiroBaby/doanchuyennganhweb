'use client'
import React from 'react';
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useGetToursQuery, useDeleteTourMutation } from '@/app/store/api/tourapi';

const TourPage = () => {
  const router = useRouter();
  const { data: tours, isLoading, error } = useGetToursQuery();
  const [deleteTour] = useDeleteTourMutation();

  const handleDeleteTour = async (tourId: number) => {
    if (window.confirm('Bạn có chắc muốn xóa tour này?')) {
      try {
        await deleteTour(tourId).unwrap();
        // Refresh data automatically through RTK Query cache invalidation
      } catch (error) {
        console.error('Failed to delete tour:', error);
        alert('Không thể xóa tour. Vui lòng thử lại.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Typography color="error">Error loading tours</Typography>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-gray-100 dark:bg-dark-body">
      <div className="h-screen p-6">
        <Card className="!bg-white dark:!bg-dark-sidebar shadow-lg h-full flex flex-col">
          <CardContent className="!p-0 flex flex-col h-full">
            {/* Button to add a new tour */}
            <div className="flex justify-end p-4">
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => router.push('/admin/tour/add')} // Chuyển đến trang thêm tour
              >
                Thêm Tour
              </Button>
            </div>

            <TableContainer component={Paper} className="!bg-transparent flex-grow overflow-hidden flex flex-col">
              <div className="flex-grow overflow-auto">
                <Table stickyHeader className="min-w-full">
                  <TableHead>
                    <TableRow>
                      <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200 !bg-gray-50 dark:!bg-dark-sidebar !text-2xl">
                        TourID
                      </TableCell>
                      <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200 !bg-gray-50 dark:!bg-dark-sidebar !text-2xl">
                        Tour Name
                      </TableCell>
                      <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200 !bg-gray-50 dark:!bg-dark-sidebar !text-2xl">
                        Image
                      </TableCell>
                      <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200 !bg-gray-50 dark:!bg-dark-sidebar !text-2xl">
                        Location
                      </TableCell>
                      <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200 !bg-gray-50 dark:!bg-dark-sidebar !text-2xl">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tours?.map((tour) => (
                      <TableRow 
                        key={tour.tour_id}
                        className="hover:!bg-gray-50 dark:hover:!bg-dark-selected transition-colors duration-150"
                      >
                        <TableCell className="!text-gray-600 dark:!text-gray-300 !text-xl">
                          {tour.tour_id}
                        </TableCell>
                        <TableCell className="!text-gray-600 dark:!text-gray-300 !text-xl">
                          {tour.tour_name}
                        </TableCell>
                        <TableCell>
                          <div className="relative w-16 h-16">
                            <Image
                              src={tour.TourImages[0]?.image_url 
                                ? `https://doanchuyennganhweb.onrender.com${tour.TourImages[0].image_url}` 
                                : '/placeholder.jpg'}
                              alt={tour.tour_name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="!text-gray-600 dark:!text-gray-300 !text-xl">
                          {tour.Location.location_name}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <IconButton 
                              onClick={() => router.push(`/admin/tour/detail/${tour.tour_id}`)}
                              className="!text-blue-500 hover:!bg-blue-50 dark:hover:!bg-blue-900"
                              size="small"
                            >
                              <EditIcon className="!w-7 !h-6" />
                            </IconButton>
                            <IconButton 
                              onClick={() => handleDeleteTour(tour.tour_id)}
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
              </div>
            </TableContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TourPage;
