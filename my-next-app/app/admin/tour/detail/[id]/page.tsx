/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useDeleteTourMutation, useGetSchedulesByTourIdQuery, useGetTourByIdQuery } from '@/app/store/api/tourapi';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Box,
    Card,
    CardContent,
    CircularProgress,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Typography
} from '@mui/material';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

const TourDetailPage = () => {
    const router = useRouter();
    const params = useParams();
    const tourId = Number(params.id);
    const { data: tour, isLoading, error } = useGetTourByIdQuery(tourId);
    const { data: schedules = [] } = useGetSchedulesByTourIdQuery(tourId);
    const [deleteTour] = useDeleteTourMutation();
    const [currentImage, setCurrentImage] = useState(0);

    const handleNextImage = () => {
        if (tour?.TourImages.length) {
            setCurrentImage((prev) => (prev + 1) % tour.TourImages.length);
        }
    };

    const handlePreviousImage = () => {
        if (tour?.TourImages.length) {
            setCurrentImage((prev) => (prev - 1 + tour.TourImages.length) % tour.TourImages.length);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Bạn có chắc muốn xóa tour này?')) {
            try {
                await deleteTour(tourId).unwrap();
                router.push('/admin/tour');
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

    if (error || !tour) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Typography color="error">Error loading tour details</Typography>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-100 dark:bg-dark-body min-h-screen">
            <Card className="!bg-white dark:!bg-dark-sidebar shadow-lg relative">
                <CardContent>
                    {/* Action Buttons */}
                    <Box position="absolute" top={10} right={10}>
                        <IconButton 
                            color="primary"
                            onClick={() => router.push(`/admin/tour/edit/${tour.tour_id}`)}
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton 
                            color="error"
                            onClick={handleDelete}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>

                    {/* Tour Title */}
                    <Typography variant="h4" component="h1" className="!font-bold !text-gray-800 dark:!text-gray-200 mb-4">
                        {tour.tour_name}
                    </Typography>

                    {/* Tour Overview */}
                    <Box display="flex" justifyContent="space-between" flexWrap="wrap">
                        <Box flex={1} className="mb-4">
                            <Typography variant="h6" className="!text-gray-700 dark:!text-gray-300">
                                Địa điểm: {tour.Location.location_name}
                            </Typography>
                            <Typography variant="h6" className="!text-gray-700 dark:!text-gray-300">
                                Thời lượng: {tour.duration} ngày
                            </Typography>
                            <Typography variant="h6" className="!text-gray-700 dark:!text-gray-300">
                                Giá: {tour.price_range}
                            </Typography>
                            <Typography variant="h6" className="!text-gray-700 dark:!text-gray-300">
                                Loại tour: {tour.TourType.type_name}
                            </Typography>
                            <Typography variant="h6" className="!text-gray-700 dark:!text-gray-300">
                                Số người tối đa: {tour.max_participants}
                            </Typography>
                        </Box>

                        {/* Image Carousel */}
                        {tour.TourImages.length > 0 && (
                            <Box flex={1} className="relative w-full h-96">
                                <Image
                                    src={tour.TourImages[currentImage].image_url}
                                    alt={tour.tour_name}
                                    layout="fill"
                                    objectFit="contain"
                                    className="rounded-lg"
                                />
                                {tour.TourImages.length > 1 && (
                                    <>
                                        <IconButton
                                            onClick={handlePreviousImage}
                                            className="absolute top-1/2 left-0 transform -translate-y-1/2 !text-gray-700 dark:!text-gray-300"
                                        >
                                            <ArrowBackIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={handleNextImage}
                                            className="absolute top-1/2 right-0 transform -translate-y-1/2 !text-gray-700 dark:!text-gray-300"
                                        >
                                            <ArrowForwardIcon />
                                        </IconButton>
                                    </>
                                )}
                            </Box>
                        )}
                    </Box>

                    {/* Description */}
                    <Box mt={4}>
                        <Typography variant="h5" className="!font-bold !text-gray-800 dark:!text-gray-200">
                            Mô tả
                        </Typography>
                        <Typography className="!text-gray-700 dark:!text-gray-300">
                            {tour.description || 'Không có mô tả'}
                        </Typography>
                    </Box>

                    {/* Schedule Info */}
                    <Box mt={4} className="bg-gray-50 dark:bg-dark-sidebar rounded-lg p-4">
                        <Typography variant="h5" className="!font-bold !text-gray-800 dark:!text-gray-200 flex items-center">
                            <CalendarTodayIcon className="mr-2" />
                            Ngày Khởi Hành
                        </Typography>
                        {schedules.length > 0 ? (
                            <List>
                                {schedules.map((schedule) => (
                                    <ListItem key={schedule.schedule_id} className="!flex !flex-col !items-start">
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle1" className="!font-semibold">
                                                    {`${new Date(schedule.start_date).toLocaleDateString()} - ${new Date(schedule.end_date).toLocaleDateString()}`}
                                                </Typography>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2">
                                                        Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(schedule.base_price))}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Số chỗ còn trống: {schedule.available_slots}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Trạng thái: {schedule.status}
                                                    </Typography>
                                                    {schedule.VehicleAssignments?.[0] && (
                                                        <Typography variant="body2">
                                                            Phương tiện: {schedule.VehicleAssignments[0].Vehicle.vehicle_type} - {schedule.VehicleAssignments[0].Vehicle.vehicle_code}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography className="!text-gray-700 dark:!text-gray-300 italic">
                                Chưa có ngày khởi hành nào được thêm vào
                            </Typography>
                        )}
                    </Box>

                    {/* Reviews - Placeholder */}
                    <Box mt={4}>
                        <Typography variant="h5" className="!font-bold !text-gray-800 dark:!text-gray-200">
                            Đánh giá
                        </Typography>
                        <Typography className="!text-gray-700 dark:!text-gray-300 italic">
                            Chưa có đánh giá nào
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
};

export default TourDetailPage;
