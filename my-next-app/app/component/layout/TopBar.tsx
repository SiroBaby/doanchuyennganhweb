"use client";
import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import {FormControl, MenuItem,  SvgIcon} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Image from "next/image";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import testImage from "../../../public/capybara.jpg";
import { toggleDarkMode } from "@/app/store/slices/darkModeSlices";

const TopBar = () => {
  //const [username, setUsername] = useState("Name");
  const [Language, setLanguage] = React.useState("10");
  const dispatch = useDispatch();
  const darkMode = useSelector((state: {darkMode: {darkMode: boolean}}) => state.darkMode.darkMode);

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
  };

  return (
    <div className="h-32 bg-[#F4F7FE] dark:bg-dark-sidebar dark:text-dark-text transition-colors duration-200">
      <nav className="flex justify-between items-center h-full px-12">
        <div>
          <h1 className="text-4xl font-bold">Dashboard</h1>
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
            <SvgIcon component={darkMode ? LightModeIcon: DarkModeIcon} className="h-auto w-8 cursor-pointer" />
          </div>
          
          <div className="flex items-center">
            <div className="w-10 h-10 relative rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={testImage}
                alt="avatar"
                fill
                className="object-cover"
              />
            </div>
            <span className="ml-3 text-lg">Hi, Name</span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default TopBar;