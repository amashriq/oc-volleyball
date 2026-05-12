import type { Metadata } from "next";
import { Geist, Geist_Mono, Oswald, Lato } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-heading",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Outta Control Volleyball",
    template: "%s | Outta Control Volleyball",
  },
  description:
    "Find and register for volleyball tournaments and open gym sessions with Outta Control Volleyball.",
  metadataBase: new URL("https://oc-volleyball.com"),
  openGraph: {
    siteName: "Outta Control Volleyball",
    type: "website",
    images: [
      {
        url: "/images/logo/oc_logo.png",
        width: 800,
        height: 600,
        alt: "Outta Control Volleyball",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} ${lato.variable} antialiased`}
      >
        <a
          href='#main-content'
          className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:font-bold focus:text-sm focus:uppercase focus:tracking-widest focus:shadow-md'
        >
          Skip to main content
        </a>
        <Navbar />
        <div id='main-content'>
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
