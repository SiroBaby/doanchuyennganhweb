"use client";
import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from 'react-redux';
import { FormControl, MenuItem, SvgIcon } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu"; // Nhập biểu tượng Menu từ MUI
import { toggleDarkMode } from "@/app/store/slices/darkModeSlices";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

const TopBar = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
  const [Language, setLanguage] = React.useState("10");
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
        <div className="lg:hidden flex items-center">
          {/* Biểu tượng Menu */}
          <SvgIcon component={MenuIcon} className="cursor-pointer" onClick={onToggleSidebar} />
        </div>
        <div className="flex items-center">
          {/* Chữ "Dashboard" */}
          <h1 className="text-4xl font-bold">Admin</h1>
        </div>
        <div className="flex items-center space-x-13">
          <FormControl variant="standard" sx={{ m: 1, minWidth: 10 }}>
            <Select
              className="text-black dark:text-dark-text"
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={Language}
              onChange={handleChange}
              label="Language"
            >
              <MenuItem value={10}>VIE</MenuItem>
              <MenuItem value={20}>ENG</MenuItem>
            </Select>
          </FormControl>

          <div className="mx-6" onClick={handleToggleDarkMode}>
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
