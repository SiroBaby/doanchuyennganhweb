import React from "react";
import Image from "next/image";
import DashboardIcon from '@mui/icons-material/Dashboard';
import TourIcon from '@mui/icons-material/Tour';
import PersonIcon from '@mui/icons-material/Person';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import { SvgIcon } from "@mui/material";
//h-screen left-0 top-0 sticky p-10 flex flex-col gap-16 bg-slate-400 shadow-xl
const LeftSideBar = () => {
  return (
    <div className="h-screen w-60 left-0 top-0 sticky flex flex-col bg-white shadow-xl">
      <div className="h-32 flex justify-center">
        <Image src="/logo/logo.png" width={120} height={0} alt="logo" />
      </div>
      <div className="left-0">
        <ul>
          <li className="border-b border-outline"></li>
          <li className="flex p-4 text-2xl font-semibold  bg-selected-corlor pl-9 items-center cursor-pointer border-r-8 border-custom-red">
            <SvgIcon component={DashboardIcon} className=" h-auto w-8 text-custom-red"/>
            <span className="ml-2 text-2xl font-bold">Dashboard</span>
          </li>
          <li className="border-b border-outline flex p-4 text-2xl font-semibold pl-9 items-center cursor-pointer">
            <SvgIcon component={TourIcon} className=" h-auto w-8 text-custom-red"/>
            <span className="ml-2 text-2xl font-bold">Tour</span>
          </li>
          <li className="border-b border-outline flex p-4 text-2xl font-semibold pl-9 items-center cursor-pointer">
            <SvgIcon component={PersonIcon} className=" h-auto w-8 text-custom-red"/>
            <span className="ml-2 text-2xl font-bold">User</span>
          </li>
          <li className="border-b border-outline flex p-4 text-2xl font-semibold pl-9 items-center cursor-pointer">
            <SvgIcon component={RequestPageIcon} className=" h-auto w-8 text-custom-red"/>
            <span className="ml-2 text-2xl font-bold">Order</span>
          </li>
          <li></li>
        </ul>
      </div>
    </div>
  );
};

export default LeftSideBar;
