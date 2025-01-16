import type { Metadata } from "next";
import { Geist, Geist_Mono, Baloo_2 } from "next/font/google";
import "./globals.css";
import Aside from "@/components/aside";

const baloo = Baloo_2({
  variable: "--font-baloo-2",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Controle Almoxarifado",
  description: "App created for stock control",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`inline-flex w-full min-h-full gap-6 ${baloo} antialiased`}
      >
        <Aside />
        <div className="flex ml-[90px] justify-center w-full min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
