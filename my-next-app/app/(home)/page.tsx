"use client";
import AnotherTopBar from '../component/layout/AnotherTopBar';
import Footer from '../component/layout/Footer';
import SearchForm from '../component/layout/SearchForm';
import TourCard from '../component/layout/TourCard';
import "../globals.css";
import { CircularProgress, Typography } from '@mui/material';

import { useGetToursQuery } from '../store/api/tourapi';


const HomePage: React.FC = () => {
  const { data: tours, isLoading, error } = useGetToursQuery();

  
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
    <div className="min-h-screen dark:bg-dark-body bg-gray-50">
      <AnotherTopBar onToggleSidebar={() => {
        throw new Error('Function not implemented.');
      }} />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold dark:text-dark-text text-gray-800 mb-4 animate-fade-in">
            Khám phá những điểm đến tuyệt vời
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Tìm kiếm và đặt tour du lịch phù hợp với bạn
          </p>
          
          {/* Search Form */}
          <div className="max-w-3xl mx-auto">
            <SearchForm />
          </div>
        </div>

        {/* Tour Cards Section */}
        <div className="space-y-8">
          {/* Popular Tours */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tour phổ biến</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {tours?.map((tour) => (
                <div key={tour.tour_id} className="transform hover:scale-105 transition duration-300">
                  <TourCard tour={tour} />
                </div>
              ))}
            </div>
          </section>

          {/* Recommended Tours */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Đề xuất cho bạn</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-center">
              {tours?.map((tour) => (
                  <div key={tour.tour_id} className="transform hover:scale-105 transition duration-300">
                    <TourCard tour={tour} />
                  </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
