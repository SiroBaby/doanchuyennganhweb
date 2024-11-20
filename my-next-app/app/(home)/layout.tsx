import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trang chủ | VAA Travel',
  description: 'Website bán tour du lịch chuyên nghiệp với nhiều tour đa dạng',
  keywords: ['shop', 'ecommerce', 'bán hàng', 'online store', 'vaa travel', 'tour du lịch', 'tour du lịch chuyên nghiệp'],
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ffffff',
  icons: {
    icon: [
      {
        url: '/logo/nobg-logo.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
    ],
    apple: '/logo/nobg-logo.png',
    shortcut: '/logo/nobg-logo.png',
  },
  openGraph: {
    title: 'Trang chủ | VAA Travel',
    description: 'Website bán hàng tour du lịch chuyên nghiệp với nhiều tour đa dạng',
    url: 'https://doanchuyennganhweb.vercel.app/',
    siteName: 'VAA Travel',
    images: [
      {
        url: '/logo/nobg-logo.png',
        width: 1200,
        height: 630,
      }
    ],
    locale: 'vi_VN',
    type: 'website',
  }
}

const HomeLayout = ({ children }: {children: React.ReactNode }) => {
    return (
        <div>
            {children}
        </div>
    )
}

export default HomeLayout