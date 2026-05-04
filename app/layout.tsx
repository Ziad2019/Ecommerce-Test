// app/layout.tsx
import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "react-hot-toast"
import { auth } from "@/lib/auth"

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
})

export const metadata: Metadata = {
  title: "ShopNext - متجرك الإلكتروني",
  description: "أفضل تجربة تسوق إلكترونية",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-cairo antialiased`}>
        <SessionProvider session={session}>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                fontFamily: "var(--font-cairo)",
                direction: "rtl",
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  )
}