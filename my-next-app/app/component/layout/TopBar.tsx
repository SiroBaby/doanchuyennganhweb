'use client'
import React from "react";
import Box from '@mui/material/Box';
import { colors, FormControl, InputLabel, MenuItem } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { BorderColor } from "@mui/icons-material";

const TopBar = () => {
  const [Language, setLanguage] = React.useState('10');

  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
  };

  const abc = [
    { label: '10', value: '10' },
    { label: '20', value: '20' },
  ]

  return (
    <div>
      Dashboard
      <Autocomplete
      options={abc}
      style={{ MozBorderStartColor: "#FF0000" }}
      sx={{ width: 300,
        border: 0,
      }}
      renderInput={(params) => <TextField {...params} label="Movie" />}
    />
      <div >
      <FormControl variant="standard" sx={{ m: 1, minWidth: 10 }}>
        <Select
        className="text-red-500"
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
      </div>
    </div>
  )
}

export default TopBar