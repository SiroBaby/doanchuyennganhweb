"use client";
import { toggleDarkMode } from "@/app/store/slices/darkModeSlices";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { FormControl, MenuItem, SvgIcon } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Logo from "../../../public/logo/nonbg-logo.png";
import { UserButton, useUser } from "@clerk/nextjs";

const TopBar = ({ }: { onToggleSidebar: () => void }) => {
  const [language, setLanguage] = React.useState("10");
  const dispatch = useDispatch();
  const darkMode = useSelector((state: { darkMode: { darkMode: boolean } }) => state.darkMode.darkMode);
  const { user } = useUser();
  const [userName, setUserName] = useState("");
  
  useEffect(() => {
    if (user) {
      setUserName(`${user.firstName} ${user.lastName}`);
    }
  }, [user]);

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
  };

  return (
    <div className="h-32 bg-admin-nav dark:bg-dark-sidebar dark:text-dark-text transition-colors duration-200">
      <nav className="flex justify-between items-center h-full px-12">
        {/* Logo section on the left */}
        <div className="flex items-center">
          <div className="w-20 h-20 relative rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={Logo}
              alt="avatar"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Right side with language selector, dark mode, avatar, and name */}
        <div className="flex items-center space-x-6">
          <FormControl variant="standard" sx={{ m: 1, minWidth: 10 }}>
            <Select
              className="text-black dark:text-dark-text"
              labelId="language-select-label"
              id="language-select"
              value={language}
              onChange={handleChange}
              label="Language"
            >
              <MenuItem value={10}>VIE</MenuItem>
              <MenuItem value={20}>ENG</MenuItem>
            </Select>
          </FormControl>

          <div onClick={handleToggleDarkMode}>
            <SvgIcon component={darkMode ? LightModeIcon : DarkModeIcon} className="h-auto w-8 cursor-pointer" />
          </div>

          <div className={`${user ? "flex items-center" : "hidden"}`}>
            <div className="w-10 h-10  flex-shrink-0 items-center flex">
              <UserButton/>
            </div>
            <span className="ml-3 text-lg">Hi, {userName}</span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default TopBar;
