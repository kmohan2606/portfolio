import type { Metadata, Viewport } from 'next'
import { Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kedarnath Mohan | Software Engineer',
  description: 'Portfolio of Kedarnath Mohan — Computer Engineering student at UGA, incoming Amazon SWE Intern, and ML researcher.',
  generator: 'Next.js',
  keywords: ['Kedarnath Mohan', 'Software Engineer', 'ML Researcher', 'Computer Engineering', 'UGA', 'Amazon', 'Portfolio', 'Python', 'React', 'TypeScript'],
  authors: [{ name: 'Kedarnath Mohan' }],
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} bg-black`}>
      <body className="font-sans antialiased bg-black text-white overflow-x-hidden">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
