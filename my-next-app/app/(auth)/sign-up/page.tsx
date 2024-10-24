import { useState } from 'react';

const DangKyDuLich = () => {
  const [thongTinNguoiDung, datThongTinNguoiDung] = useState({
    hoVaTen: '',
    email: '',
    soDienThoai: '',
    tenDangNhap: '',
    matKhau: '',
    nhapLaiMatKhau: ''
  });

  const xuLyThayDoi = (e) => {
    const { name, value } = e.target;
    datThongTinNguoiDung(duLieuCu => ({
      ...duLieuCu,
      [name]: value
    }));
  };

  const xuLyDangKy = (e) => {
    e.preventDefault();
    console.log('Thông tin đăng ký:', thongTinNguoiDung);
  };

  return (
    <div style={styles.trangDangKy}>
      <div style={styles.containerDangKy}>
        <div style={styles.phanHinhAnh}>
          <img 
            src="/duong-dan-den-logo.png" 
            alt="Logo" 
            style={styles.logo}
          />
          <h2>Du lịch theo cách sống của bạn</h2>
          <img 
            src="/duong-dan-den-anh-du-lich.jpg" 
            alt="Ảnh du lịch" 
            style={styles.anhDuLich}
          />
        </div>
        
        <div style={styles.phanBieuMau}>
          <h1>Đăng ký</h1>
          <form onSubmit={xuLyDangKy}>
            <div style={styles.nhomTruong}>
              <input
                type="text"
                name="hoVaTen"
                placeholder="Họ và tên"
                value={thongTinNguoiDung.hoVaTen}
                onChange={xuLyThayDoi}
                style={styles.input}
              />
            </div>
            
            <div style={styles.nhomTruong}>
              <input
                type="email"
                name="email"
                placeholder="Email..."
                value={thongTinNguoiDung.email}
                onChange={xuLyThayDoi}
                style={styles.input}
              />
            </div>

            <div style={styles.nhomTruong}>
              <input
                type="tel"
                name="soDienThoai"
                placeholder="Số điện thoại"
                value={thongTinNguoiDung.soDienThoai}
                onChange={xuLyThayDoi}
                style={styles.input}
              />
            </div>

            <div style={styles.nhomTruong}>
              <input
                type="text"
                name="tenDangNhap"
                placeholder="Tên đăng nhập"
                value={thongTinNguoiDung.tenDangNhap}
                onChange={xuLyThayDoi}
                style={styles.input}
              />
            </div>

            <div style={styles.nhomTruong}>
              <input
                type="password"
                name="matKhau"
                placeholder="Mật khẩu"
                value={thongTinNguoiDung.matKhau}
                onChange={xuLyThayDoi}
                style={styles.input}
              />
            </div>

            <div style={styles.nhomTruong}>
              <input
                type="password"
                name="nhapLaiMatKhau"
                placeholder="Nhập lại mật khẩu"
                value={thongTinNguoiDung.nhapLaiMatKhau}
                onChange={xuLyThayDoi}
                style={styles.input}
              />
            </div>

            <button type="submit" style={styles.nutDangKy}>
              Đăng ký
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  trangDangKy: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fce4ec',
    padding: '20px',
  },
  containerDangKy: {
    display: 'flex',
    background: 'white',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '1200px',
  },
  phanHinhAnh: {
    flex: 1,
    padding: '40px',
    background: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: '120px',
    marginBottom: '20px',
  },
  anhDuLich: {
    width: '100%',
    height: 'auto',
    borderRadius: '15px',
    marginTop: '20px',
  },
  phanBieuMau: {
    flex: 1,
    padding: '40px',
  },
  nhomTruong: {
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border-color 0.3s',
  },
  inputFocus: {
    borderColor: '#2196f3',
    outline: 'none',
  },
  nutDangKy: {
    width: '100%',
    padding: '12px',
    background: '#f50057',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  nutDangKyHover: {
    background: '#c51162',
  }
};

export default DangKyDuLich;
