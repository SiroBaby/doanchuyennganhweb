"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => {
  return (
    <div className="w-full bg-custom-blue py-8 px-4 md:px-12">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex justify-between items-start">
          <div className="w-40 h-40 relative">
            <Image
              src="/logo/logo.png"
              alt="FAA Travel Logo"
              width={160}
              height={160}
              className="object-contain"
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg">DU LỊCH TRONG NƯỚC</h3>
            <ul className="space-y-2">
              <li><Link href="/lang-son" className="hover:text-blue-600">Lang Sơn</Link></li>
              <li><Link href="/ha-giang" className="hover:text-blue-600">Hà Giang</Link></li>
              <li><Link href="/ha-noi" className="hover:text-blue-600">Hà Nội</Link></li>
              <li><Link href="/binh-thuan" className="hover:text-blue-600">Bình Thuận</Link></li>
              <li><Link href="/ba-ria-vung-tau" className="hover:text-blue-600">Bà Rịa - Vũng Tàu</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg text-transparent">.</h3>
            <ul className="space-y-2">
              <li>Lạng Sơn</li>
              <li>Lạng Sơn</li>
              <li>Lạng Sơn</li>
              <li>Lạng Sơn</li>
              <li>Lạng Sơn</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">LIÊN HỆ</h3>
            <div className="space-y-2">
              <p>SĐT: 0123456789</p>
              <a href="https://www.google.com/maps/place/H%E1%BB%8Dc+Vi%E1%BB%87n+H%C3%A0ng+Kh%C3%B4ng+Vi%E1%BB%87t+Nam+CS2/@10.7999506,106.6533982,18.59z/data=!4m6!3m5!1s0x3175292976c117ad:0x5b3f38b21051f84!8m2!3d10.8000211!4d106.6544162!16s%2Fg%2F1td1mcc1?hl=vi-VN&entry=ttu&g_ep=EgoyMDI0MTEwNi4wIKXMDSoASAFQAw%3D%3D">
                <p>Địa chỉ: 18A/1 Cộng Hòa, phường 12, Tân Bình, TP.HCM</p>
              </a>
              <div className="flex items-center space-x-4">
                <a href="https://www.facebook.com/phat.huynhngoc.3" target="_blank" rel="noopener noreferrer">
                  <FacebookIcon className="text-2xl" />
                </a>
                <a href="https://github.com/huyen35" target="_blank" rel="noopener noreferrer">
                  <GitHubIcon className="text-2xl" />
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg">THÔNG TIN</h3>
            <ul className="space-y-2">
              <li>Tin tức</li>
              <li>Tin tức</li>
              <li>Tin tức</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center mt-8 text-sm text-gray-600 border-t pt-4">
        <p>Đồ án chuyên ngành - Học kì I - 2024-2025</p>
      </div>
    </div>
  );
};

export default Footer;