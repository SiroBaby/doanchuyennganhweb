'use client';
import localFont from "next/font/local";
import "../globals.css";
import { Providers } from "../providers";
import AnotherTopBar from '../component/layout/AnotherTopBar';
import Footer from "../component/layout/Footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useGetUserByIdQuery } from "../store/api/userapi";

// Load fonts locally
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

export default function TourDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { userId, isLoaded } = useAuth();
  const { data: userData, isLoading } = useGetUserByIdQuery(`"${userId}"` as string, {
    skip: !userId
  });

  // Ensure component is mounted before rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Authentication and authorization check
  useEffect(() => {
    if (isLoaded) {
      if (!userId) {
        // Allow unauthenticated users to view tour details
        return;
      } else if (!isLoading && userData) {
        // Check user permissions if necessary
        return;
      }
    }
  }, [isLoaded, userId, userData, isLoading, router]);

  if (!isMounted || !isLoaded || isLoading) return null;

  return (
    <div className={`${geistSans.variable} ${geistMono.variable}`}>
      <Providers>
        {/* Add dark mode background class to the root container */}
        <div className="min-h-screen dark:bg-dark-body bg-gray-50">
            <AnotherTopBar onToggleSidebar={() => {
                throw new Error('Function not implemented.');
            }} />
          <main>
            {/* Breadcrumb */}
            <div className="bg-white dark:bg-dark-sidebar shadow-sm">
              <div className="container mx-auto px-4 py-3">
                <nav className="flex" aria-label="Breadcrumb">
                  <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                      <a href="/" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                        Trang chủ
                      </a>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <span className="mx-2 text-gray-400">/</span>
                        <span className="text-gray-500 dark:text-gray-400">Chi tiết tour</span>
                      </div>
                    </li>
                  </ol>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {children}
            </div>
          </main>
        </div>

        {/* Footer */}
        <Footer />
      </Providers>
    </div>
  );
}