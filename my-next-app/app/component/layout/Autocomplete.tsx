import { Autocomplete, TextField } from '@mui/material';

const SelectCountry = () => {
  const provinces = [
    { code: "1", label: "An Giang" },
    { code: "2", label: "Bà Rịa-Vũng Tàu" },
    { code: "3", label: "Bắc Giang" },
    { code: "4", label: "Bắc Kạn" },
    { code: "5", label: "Bạc Liêu" },
    { code: "6", label: "Bắc Ninh" },
    { code: "7", label: "Bến Tre" },
    { code: "8", label: "Bình Định" },
    { code: "9", label: "Bình Dương" },
    { code: "10", label: "Bình Phước" },
    { code: "11", label: "Bình Thuận" },
    { code: "12", label: "Cà Mau" },
    { code: "13", label: "Cần Thơ" },
    { code: "14", label: "Cao Bằng" },
    { code: "15", label: "Đà Nẵng" },
    { code: "16", label: "Đắk Lắk" },
    { code: "17", label: "Đắk Nông" },
    { code: "18", label: "Điện Biên" },
    { code: "19", label: "Đồng Nai" },
    { code: "20", label: "Đồng Tháp" },
    { code: "21", label: "Gia Lai" },
    { code: "22", label: "Hà Giang" },
    { code: "23", label: "Hà Nam" },
    { code: "24", label: "Hà Nội" },
    { code: "25", label: "Hà Tĩnh" },
    { code: "26", label: "Hải Dương" },
    { code: "27", label: "Hải Phòng" },
    { code: "28", label: "Hậu Giang" },
    { code: "29", label: "TP. Hồ Chí Minh" },
    { code: "30", label: "Hòa Bình" },
    { code: "31", label: "Hưng Yên" },
    { code: "32", label: "Khánh Hòa" },
    { code: "33", label: "Kiên Giang" },
    { code: "34", label: "Kon Tum" },
    { code: "35", label: "Lai Châu" },
    { code: "36", label: "Lâm Đồng" },
    { code: "37", label: "Lạng Sơn" },
    { code: "38", label: "Lào Cai" },
    { code: "39", label: "Long An" },
    { code: "40", label: "Nam Định" },
    { code: "41", label: "Nghệ An" },
    { code: "42", label: "Ninh Bình" },
    { code: "43", label: "Ninh Thuận" },
    { code: "44", label: "Phú Thọ" },
    { code: "45", label: "Phú Yên" },
    { code: "46", label: "Quảng Bình" },
    { code: "47", label: "Quảng Nam" },
    { code: "48", label: "Quảng Ngãi" },
    { code: "49", label: "Quảng Ninh" },
    { code: "50", label: "Quảng Trị" },
    { code: "51", label: "Sóc Trăng" },
    { code: "52", label: "Sơn La" },
    { code: "53", label: "Tây Ninh" },
    { code: "54", label: "Thái Bình" },
    { code: "55", label: "Thái Nguyên" },
    { code: "56", label: "Thanh Hóa" },
    { code: "57", label: "Thừa Thiên - Huế" },
    { code: "58", label: "Tiền Giang" },
    { code: "59", label: "Trà Vinh" },
    { code: "60", label: "Tuyên Quang" },
    { code: "61", label: "Vĩnh Long" },
    { code: "62", label: "Vĩnh Phúc" },
    { code: "63", label: "Yên Bái" }
  ];

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Autocomplete
        id="province-select"
        options={provinces}
        getOptionLabel={(option) => `${option.label} (${option.code})`}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Chọn tỉnh thành"
            variant="outlined"
          />
        )}
        renderOption={(props, option) => (
          <li {...props}>
            {option.label}
          </li>
        )}
      />
    </div>
  );
};

export default SelectCountry;