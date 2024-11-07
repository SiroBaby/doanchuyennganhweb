"use client";
import AnotherTopBar from '../component/layout/AnotherTopBar';
import SearchForm from '../component/layout/SearchForm';
import TourCard from '../component/layout/TourCard';
import "../globals.css";


const HomePage: React.FC = () => {
  return (
    <div>
      <AnotherTopBar onToggleSidebar={function (): void {
        throw new Error('Function not implemented.');
      } } />
      <br />
      <SearchForm />
      <br />
      <h1>chào mừng m đến với Home Page</h1>
      <br/>
      <TourCard/>
    </div>
  );
};


export default HomePage;
