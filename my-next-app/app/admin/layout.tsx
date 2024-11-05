'use client';
import localFont from "next/font/local";
import "../globals.css";
import { Providers } from "../providers";
import LeftSideBar from "../component/layout/LeftSideBar";
import TopBar from "../component/layout/TopBar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useGetUserByIdQuery } from "../store/api/userapi";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { userId, isLoaded } = useAuth();
  const { data: userData, isLoading } = useGetUserByIdQuery(`"${userId}"` as string, {
    skip: !userId
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      if (!userId) {
        router.push('/sign-in');
      } else if (!isLoading && userData) {
        if (userData.role_id !== 1) {
          router.push('/');
        }
      } else if (!isLoading && !userData) {
          router.push('/');
      }
    }
  }, [isLoaded, userId, userData, isLoading, router]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleItemClick = (path: string) => {
    router.push(path);
    setSidebarOpen(false);
  };

  if (!isMounted || !isLoaded || isLoading) return null;

  return (
    <div className={`${geistSans.variable} ${geistMono.variable}`}>
      <Providers>
        <div className="flex">
          {/* Sidebar cho màn hình lớn */}
          <div className={`hidden lg:block fixed top-0 left-0 h-screen w-60 bg-white shadow-xl dark:bg-dark-sidebar transition-transform duration-300`}>
            <LeftSideBar onItemClick={handleItemClick} onClose={handleCloseSidebar} />
          </div>
          {/* Sidebar cho màn hình nhỏ */}
          <div className={`fixed top-0 left-0 h-screen w-60 bg-white shadow-xl dark:bg-dark-sidebar transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'}`}>
            <LeftSideBar onItemClick={handleItemClick} onClose={handleCloseSidebar} />
          </div>
          {/* Nội dung chính */}
          <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-60' : 'lg:ml-60'}`}>
            <TopBar onToggleSidebar={toggleSidebar} />
            <main>{children}</main>
          </div>
        </div>
      </Providers>
    </div>
  );
}