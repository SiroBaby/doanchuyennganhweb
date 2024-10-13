import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { Providers } from "../providers";
import LeftSideBar from "../component/layout/LeftSideBar";
import TopBar from "../component/layout/TopBar";

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

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard to manage website",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <Providers>
        {/* Với màn hình nhỏ hơn lg, chỉ hiển thị TopBar và Body */}
        <div className="flex flex-col lg:flex-row">
          {/* Hiển thị LeftSideBar khi màn hình lg trở lên */}
          <div className="hidden lg:flex">
            <LeftSideBar />
          </div>
          {/* Phần TopBar luôn hiển thị */}
          <div className="flex-1 flex flex-col">
            <TopBar />
            {/* Nội dung body */}
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </Providers>
    </div>
  );
}
