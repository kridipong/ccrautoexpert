import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'CCRAutoExpert — อะไหล่รถยนต์คุณภาพ',
  description: 'ผู้จำหน่ายอะไหล่รถยนต์ครบวงจร ช่วงล่าง เบรก เครื่องยนต์ น้ำมันเครื่อง ทุกยี่ห้อทุกรุ่น | Quality auto parts for every vehicle',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
