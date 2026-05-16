'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, Search, Menu, X, Wrench } from 'lucide-react'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 hidden sm:block">
              CCR<span className="text-red-600">AUTO</span>
            </span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden sm:flex">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาอะไหล่ / Search parts..."
                className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="relative p-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                0
              </span>
            </Link>
            <Link
              href="/account"
              className="hidden sm:inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-red-500 hover:text-red-600 transition-colors"
            >
              เข้าสู่ระบบ
            </Link>
            <button
              className="sm:hidden p-2 text-gray-600"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-6 pb-2 text-sm font-medium text-gray-600">
          <Link href="/shop" className="hover:text-red-600 transition-colors">
            สินค้าทั้งหมด / All Parts
          </Link>
          <Link href="/shop?category=chassis-brakes" className="hover:text-red-600 transition-colors">
            ช่วงล่าง / Chassis
          </Link>
          <Link href="/shop?category=engine-drivetrain" className="hover:text-red-600 transition-colors">
            เครื่องยนต์ / Engine
          </Link>
          <Link href="/shop?category=engine-oil-fluids" className="hover:text-red-600 transition-colors">
            น้ำมัน / Fluids
          </Link>
          <Link href="/shop?category=car-care-equipment" className="hover:text-red-600 transition-colors">
            ดูแลรถ / Car Care
          </Link>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาอะไหล่..."
                className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-red-600 text-white rounded-md">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>
          {[
            { href: '/shop', label: 'สินค้าทั้งหมด' },
            { href: '/shop?category=chassis-brakes', label: 'ช่วงล่างและเบรก' },
            { href: '/shop?category=engine-drivetrain', label: 'เครื่องยนต์' },
            { href: '/shop?category=engine-oil-fluids', label: 'น้ำมันเครื่อง' },
            { href: '/account', label: 'เข้าสู่ระบบ' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-gray-700 hover:text-red-600 border-b border-gray-50 last:border-0"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
