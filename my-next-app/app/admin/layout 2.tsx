'use client';
import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { Providers } from "../providers";
import LeftSideBar from "../component/layout/LeftSideBar";
import TopBar from "../component/layout/TopBar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleItemClick = (path: string) => {
    router.push(path); // Chuyển hướng đến đường dẫn mới
    setSidebarOpen(false); // Đóng sidebar khi chuyển trang
  };

  if (!isMounted) return null; // Trả về null nếu chưa mount

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
