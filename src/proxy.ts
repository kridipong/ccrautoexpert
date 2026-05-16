import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session so it stays alive
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isAccountRoute = pathname.startsWith('/account')
  const isAuthPage = pathname === '/account/login' || pathname === '/account/register'

  // Redirect unauthenticated users away from protected account pages
  if (isAccountRoute && !isAuthPage && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/account/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Redirect logged-in users away from login/register
  if (isAuthPage && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/account'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/account/:path*'],
}
