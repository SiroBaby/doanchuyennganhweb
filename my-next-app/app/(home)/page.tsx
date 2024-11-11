"use client";
import AnotherTopBar from '../component/layout/AnotherTopBar';
import SearchForm from '../component/layout/SearchForm';
import TourCard from '../component/layout/TourCard';
import "../globals.css";

const HomePage: React.FC = () => {
  return (
    <div>
      <AnotherTopBar onToggleSidebar={() => {
        throw new Error('Function not implemented.');
      }} />
      <br />
      {/* Centered SearchForm */}
      <div className="flex justify-center">
        <SearchForm />
      </div>
      <br />
      <h1 style={{ marginLeft: '5px', marginRight: '5px' }}>Chào mừng m đến với Home Page</h1>
      <br />
      {/* TourCard Container with padding */}
      <div style={{ marginLeft: '5px', marginRight: '5px' }}>
        <div className="flex space-x-4">
          <div><TourCard /></div>
          <div><TourCard /></div>
          <div><TourCard /></div>
          <div><TourCard /></div>
          <div><TourCard /></div>
        </div>
      </div>
      <br />
      <div style={{ marginLeft: '5px', marginRight: '5px' }}>
        <div className="flex space-x-4">
          <div><TourCard /></div>
          <div><TourCard /></div>
          <div><TourCard /></div>
          <div><TourCard /></div>
          <div><TourCard /></div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
