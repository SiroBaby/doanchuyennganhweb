import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers, DarkModeHandler } from "./providers";
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: 'Trang chủ | VAA Travel',
  description: 'Website bán tour du lịch chuyên nghiệp với nhiều tour đa dạng',
  keywords: ['shop', 'ecommerce', 'bán hàng', 'online store'],
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ffffff',
  icons: {
    icon: '/logo/nobg-logo.png', // Favicon for browser tab
    apple: '/logo/nobg-logo.png', // For Apple devices
    shortcut: '/logo/nobg-logo.png', // Shortcut icon
  },
  openGraph: {
    title: 'Trang chủ | VAA Travel',
    description: 'Website bán hàng tour du lịch chuyên nghiệp với nhiều tour đa dạng',
    url: 'https://your-domain.com',
    siteName: 'Tên Website',
    images: [
      {
        url: '././public/logo/nobg-logo.png',
        width: 1200,
        height: 630,
      }
    ],
    locale: 'vi_VN',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <Providers>
          <body className={inter.className}>
            <DarkModeHandler/>
            <main>{children}</main>
          </body>
        </Providers>
      </html>
    </ClerkProvider>
  );
}
