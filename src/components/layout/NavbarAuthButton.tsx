'use client'

import Link from 'next/link'
import { User } from 'lucide-react'

export default function NavbarAuthButton({ user }: { user: { email: string; name: string } | null }) {
  if (user) {
    const initials = user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    return (
      <Link
        href="/account"
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg hover:border-red-400 transition-colors"
      >
        <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
          {initials || <User className="w-3 h-3" />}
        </div>
        <span className="text-sm text-gray-700 max-w-[100px] truncate">{user.name}</span>
      </Link>
    )
  }

  return (
    <Link
      href="/account/login"
      className="hidden sm:inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-red-500 hover:text-red-600 transition-colors"
    >
      เข้าสู่ระบบ
    </Link>
  )
}
