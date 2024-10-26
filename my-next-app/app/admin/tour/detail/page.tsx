'use client'
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Divider,
    Modal
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Image from 'next/image';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const TourDetailPage = () => {
    const tour = {
        id: 1,
        name: 'Du lịch Hà Nội 3 ngày',
        duration: '3 ngày, 2 đêm',
        location: 'Hà Nội, Việt Nam',
        schedules: [
            {
                startDate: '01/12/2024',
                endDate: '03/12/2024',
                basePrice: '2,000,000 VND',
                status: 'Sẵn sàng',
                vehicle: {
                    code: 'VN123',
                    type: 'Xe khách',
                    maxCapacity: 45,
                    availableSeats: 10,
                    priceAdjustment: '-200,000 VND'
                }
            },
            {
                startDate: '05/12/2024',
                endDate: '07/12/2024',
                basePrice: '2,100,000 VND',
                status: 'Sẵn sàng',
                vehicle: {
                    code: 'VN124',
                    type: 'Xe giường nằm',
                    maxCapacity: 30,
                    availableSeats: 15,
                    priceAdjustment: '-150,000 VND'
                }
            },
            {
                startDate: '10/12/2024',
                endDate: '12/12/2024',
                basePrice: '2,050,000 VND',
                status: 'Đã hết chỗ',
                vehicle: {
                    code: 'VN125',
                    type: 'Xe khách',
                    maxCapacity: 45,
                    availableSeats: 0,
                    priceAdjustment: '-250,000 VND'
                }
            }
        ],
        images: [
            '/z5919084492276_2ffe487b14cfad62910ca5ec07b0118c.jpg',
            '/2024_09_01_13_30_IMG_5734.JPG',
            '/2024_09_01_13_27_IMG_5737.JPG'
        ],
        reviews: [
            { rating: 4.5, comment: 'Tour rất tuyệt!', reviewDate: '2023-12-01' },
            { rating: 5, comment: 'Hướng dẫn viên vui tính.', reviewDate: '2023-12-05' }
        ]
    };

    const [currentImage, setCurrentImage] = useState(0);
    const [openCalendar, setOpenCalendar] = useState(false);
    const handleNextImage = () => {
        setCurrentImage((prev) => (prev + 1) % tour.images.length);
    };

    const handlePreviousImage = () => {
        setCurrentImage((prev) => (prev - 1 + tour.images.length) % tour.images.length);
    };

    const toggleCalendarModal = () => {
        setOpenCalendar(!openCalendar);
    };

    return (
        <div className="p-6 bg-gray-100 dark:bg-dark-body min-h-screen">
            <Card className="!bg-white dark:!bg-dark-sidebar shadow-lg relative">
                <CardContent>
                    {/* Action Buttons */}
                    <Box position="absolute" top={10} right={10}>
                        <IconButton color="primary">
                            <EditIcon />
                        </IconButton>
                        <IconButton color="secondary">
                            <DeleteIcon />
                        </IconButton>
                    </Box>

                    {/* Tour Title */}
                    <Typography variant="h4" component="h1" className="!font-bold !text-gray-800 dark:!text-gray-200 mb-4">
                        {tour.name}
                    </Typography>

                    {/* Tour Overview */}
                    <Box display="flex" justifyContent="space-between" flexWrap="wrap">
                        <Box flex={1} className="mb-4">
                            <Typography variant="h6" className="!text-gray-700 dark:!text-gray-300">
                                Địa điểm: {tour.location}
                            </Typography>
                            <Typography variant="h6" className="!text-gray-700 dark:!text-gray-300">
                                Thời lượng: {tour.duration}
                            </Typography>
                        </Box>

                        {/* Image Carousel */}
                        <Box flex={1} className="relative w-full h-96">
                            <Image
                                src={tour.images[currentImage]}
                                alt="Tour Image"
                                layout="fill"
                                objectFit="contain"
                                className="rounded-lg"
                            />
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
                        </Box>
                    </Box>

                    {/* Schedule Info */}
                    <Box mt={4} className="bg-gray-50 dark:bg-dark-sidebar rounded-lg p-4">
                        <Typography variant="h5" className="!font-bold !text-gray-800 dark:!text-gray-200 flex items-center">
                            <CalendarTodayIcon className="mr-2" />
                            Lịch trình
                        </Typography>
                        {tour.schedules.map((schedule, index) => (
                            <Box key={index} mb={2} className="bg-white dark:bg-dark-body rounded-lg p-3 shadow">
                                <Typography className="!text-gray-800 dark:!text-gray-200">
                                    Ngày khởi hành: {schedule.startDate} - {schedule.endDate}
                                </Typography>
                                <Typography className="!text-gray-800 dark:!text-gray-200">
                                    Giá cơ bản: <span className="font-bold text-blue-600">{schedule.basePrice}</span>
                                </Typography>
                                <Typography className="!text-gray-800 dark:!text-gray-200">
                                    Tình trạng: <span className={schedule.status === 'Sẵn sàng' ? 'text-green-600' : 'text-red-600'}>{schedule.status}</span>
                                </Typography>
                                <Typography className="!text-gray-800 dark:!text-gray-200">
                                    Phương tiện: <span className="font-bold">{schedule.vehicle.type}</span> (Mã: <span className="font-bold text-blue-600">{schedule.vehicle.code}</span>)
                                </Typography>
                                <Typography className="!text-gray-800 dark:!text-gray-200">
                                    Sức chứa tối đa: <span className="font-bold">{schedule.vehicle.maxCapacity}</span> - Số ghế trống: <span className="font-bold text-red-600">{schedule.vehicle.availableSeats}</span>
                                </Typography>
                                <Typography className="!text-gray-800 dark:!text-gray-200">
                                    Điều chỉnh giá: <span className="font-bold">{schedule.vehicle.priceAdjustment}</span>
                                </Typography>
                                <Divider />
                            </Box>
                        ))}
                    </Box>

                    {/* Reviews */}
                    <Box mt={4}>
                        <Typography variant="h5" className="!font-bold !text-gray-800 dark:!text-gray-200">
                            Đánh giá
                        </Typography>
                        <List>
                            {tour.reviews.map((review, index) => (
                                <React.Fragment key={index}>
                                    <ListItem alignItems="flex-start">
                                        {[...Array(Math.floor(review.rating))].map((_, idx) => (
                                            <StarIcon key={idx} color="primary" />
                                        ))}
                                        <ListItemText
                                            primary={`Xếp hạng: ${review.rating}`}
                                            className="!text-gray-800 dark:!text-gray-200"
                                            secondary={
                                                <React.Fragment>
                                                    <Typography component="span" variant="body2" className="!text-gray-800 dark:!text-gray-200">
                                                        {review.comment}{" — " + review.reviewDate}
                                                    </Typography>

                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                    {index < tour.reviews.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
};

export default TourDetailPage;
