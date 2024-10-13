'use client'
import React, { useState, useEffect, startTransition } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation"; // Sử dụng usePathname và useRouter
import DashboardIcon from "@mui/icons-material/Dashboard";
import TourIcon from "@mui/icons-material/Tour";
import PersonIcon from "@mui/icons-material/Person";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import { SvgIcon } from "@mui/material";

const LeftSideBar = () => {
  const [selectedItem, setSelectedItem] = useState(""); // State for selected item
  const [loading, setLoading] = useState(false); // State for loading
  const router = useRouter();
  const pathname = usePathname(); // Lấy đường dẫn hiện tại

  // Đồng bộ selectedItem với URL hiện tại khi component được mount
  useEffect(() => {
    if (pathname.includes("/admin-dashboard")) {
      setSelectedItem("dashboard");
    } else if (pathname.includes("/tour")) {
      setSelectedItem("tour");
    } else if (pathname.includes("/admin/user")) {
      setSelectedItem("user");
    } else if (pathname.includes("/admin/order")) {
      setSelectedItem("order");
    }
  }, [pathname]);

  // Handle item click with loading effect
  const handleItemClick = (item: string, path: string) => {
    setLoading(true); // Bắt đầu hiển thị loading khi click vào li

    // Sử dụng startTransition để quản lý trạng thái chuyển trang
    startTransition(() => {
      router.push(path); // Điều hướng trang
    });
  };

  // Sau khi điều hướng, tắt trạng thái loading
  useEffect(() => {
    setLoading(false); // Dừng loading khi đường dẫn (pathname) thay đổi
  }, [pathname]);

  return (
    <div className="h-screen w-60 left-0 top-0 sticky flex flex-col bg-white shadow-xl dark:bg-dark-sidebar transition-colors duration-200">
      <div className="h-32 flex justify-center">
        <Image src="/logo/logo.png" width={120} height={0} alt="logo" />
      </div>
      <div className="left-0 dark:text-dark-text">
        <ul>
          <li className="border-b border-outline dark:border-dark-outline"></li>

          {/* Thêm hiệu ứng loading khi đang chờ nội dung load */}
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <span className="text-lg font-bold">Loading...</span>
            </div>
          ) : (
            <>
              <li
                className={`flex p-4 text-2xl font-semibold pl-9 items-center cursor-pointer border-r-8 ${
                  selectedItem === "dashboard"
                    ? "border-custom-red bg-selected-corlor dark:bg-dark-selected"
                    : "border-transparent"
                }`}
                onClick={() => handleItemClick("dashboard", "/admin-dashboard")}
              >
                <SvgIcon component={DashboardIcon} className="h-auto w-8 text-custom-red" />
                <span className="ml-2 text-2xl font-bold">Dashboard</span>
              </li>
              
              <li
                className={`flex p-4 text-2xl font-semibold pl-9 items-center cursor-pointer border-r-8 ${
                  selectedItem === "tour"
                    ? "border-custom-red bg-selected-corlor dark:bg-dark-selected"
                    : "border-transparent"
                }`}
                onClick={() => handleItemClick("tour", "/tour")}
              >
                <SvgIcon component={TourIcon} className="h-auto w-8 text-custom-red" />
                <span className="ml-2 text-2xl font-bold">Tour</span>
              </li>

              <li
                className={`flex p-4 text-2xl font-semibold pl-9 items-center cursor-pointer border-r-8 ${
                  selectedItem === "user"
                    ? "border-custom-red bg-selected-corlor dark:bg-dark-selected"
                    : "border-transparent"
                }`}
                onClick={() => handleItemClick("user", "/admin/user")}
              >
                <SvgIcon component={PersonIcon} className="h-auto w-8 text-custom-red" />
                <span className="ml-2 text-2xl font-bold">User</span>
              </li>

              <li
                className={`flex p-4 text-2xl font-semibold pl-9 items-center cursor-pointer border-r-8 ${
                  selectedItem === "order"
                    ? "border-custom-red bg-selected-corlor dark:bg-dark-selected"
                    : "border-transparent"
                }`}
                onClick={() => handleItemClick("order", "/admin/order")}
              >
                <SvgIcon component={RequestPageIcon} className="h-auto w-8 text-custom-red" />
                <span className="ml-2 text-2xl font-bold">Order</span>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default LeftSideBar;
