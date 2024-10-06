"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import {colors, FormControl, InputLabel,  MenuItem,  SvgIcon} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Image from "next/image";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import testImage from "../../../public/capybara.jpg";

const TopBar = () => {
  const [username, setUsername] = useState("Name");
  const [Language, setLanguage] = React.useState("10");

  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
  };

  return (
    <div className="h-32 bg-[#F4F7FE]">
      <nav className="flex justify-between items-center h-full px-12">
        <div>
          <h1 className="text-4xl font-bold">Dashboard</h1>
        </div>

        <div className="flex items-center space-x-13">
          <FormControl variant="standard" sx={{ m: 1, minWidth: 10 }}>
            <Select
              className="text-black"
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

          <div className="mx-6">
            <SvgIcon component={LightModeIcon} className="h-auto w-8 cursor-pointer" />
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
            <span className="ml-3 text-lg">Hi, {username}</span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default TopBar;