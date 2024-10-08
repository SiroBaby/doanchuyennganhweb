'use client';

import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store/store';
import { setDarkMode } from './store/slices/darkModeSlices';

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

// Tạo một component riêng để xử lý dark mode
export function DarkModeHandler() {
  const darkMode = useSelector((state: {darkMode: {darkMode: boolean}}) => state.darkMode.darkMode);
  const dispatch = useDispatch();

  useEffect(() => {
    // Kiểm tra chế độ dark mode từ localStorage
    const savedTheme = localStorage.getItem('darkMode') === 'true';
    dispatch(setDarkMode(savedTheme));
    if (savedTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dispatch]);

  useEffect(() => {
    // Lưu trạng thái dark mode vào localStorage
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return null; // Không cần render gì trong component này
}
