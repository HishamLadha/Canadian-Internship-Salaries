import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "@/components/custom/nav";
import { Toaster } from "@/components/ui/sonner"
import Script from "next/script";
import Footer from "@/components/custom/footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: 'Scoper - Canadian Internship Salaries',
  description: 'Your go-to resource for Canadian internship salary data.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script 
          async
          src="https://cloud.umami.is/script.js" 
          data-website-id="8e9948ac-32f0-4108-a8e3-c570a5b35a3b"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Nav />
        {children}
        <Toaster />
        <Footer />
      </body>

    </html>
  );
}
