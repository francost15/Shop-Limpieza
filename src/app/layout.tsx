import type { Metadata } from "next";
import { Sidebar } from "@/components/ui/Sidebar"
import localFont from "next/font/local";
import "./globals.css";

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
import { IoPeople, IoCart, IoDocumentText, IoBag, IoLockClosed, IoPencil } from "react-icons/io5"
import { MdManageHistory, MdOutlinePayment, MdReviews } from "react-icons/md"
import { LuUser2 } from "react-icons/lu";
import { HistoryIcon } from "lucide-react";


interface SidebarItem {
  title: string;
  icon: JSX.Element;
  link: string;
}

export const metadata: Metadata = {
  title: "CRUD Management",
  description: "Generated by create next app",
};
  const sidebarItems: SidebarItem[] = [
    { title: "Customers", icon: <IoPeople size={20} />, link: "/customers" },
    { title: "Shopping Carts", icon: <IoCart size={20} />, link: "/carts" },
    { title: "Cart Details", icon: <IoDocumentText size={20} />, link: "/cart-details" },
    { title: "Order Details", icon: <IoBag size={20} />, link: "/order-details" },
    {
      title: "Order History",
      icon: <HistoryIcon size={20} />,
      link: "/order-history",
    },
    {
      title: "login-security",
      icon: <IoLockClosed size={20} />,
      link: "/login-security",
    },
    {
      title: "payment-methods",
      icon: <MdOutlinePayment size={20} />,
      link: "/payment-methods",
    },
    {
      title: "product-management",
      icon: <MdManageHistory size={20} />,
      link: "/order-managment",
    },
    {
      title: "product-reviews",
      icon: <MdReviews size={20} />,
      link: "/product-reviews",
    },
    {
      title: "role-management",
      icon: <IoPencil size={20} />,
      link: "/role-management",
    },
  {
    title: "user-management",
    icon: <LuUser2 size={20} />,
    link: "/user-management",
  }
  ];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > 
        <Sidebar items={sidebarItems} />
        {children}
      </body>
    </html>
  );
}
