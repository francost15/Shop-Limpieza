"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IoHome, IoMenuSharp } from "react-icons/io5"

interface SidebarItem {
  title: string;
  icon: JSX.Element;
  link: string;
}

interface SidebarProps {
  items: SidebarItem[];
}

export function Sidebar({ items }: SidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <div 
        className={`fixed left-0 top-0 z-30 h-screen transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64' : 'w-16'
        } bg-neutral-900 text-white`}
      >
        <Button
          variant="ghost"
          size="icon"
          className="w-full h-12 flex justify-center items-center text-white hover:bg-neutral-700"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <IoMenuSharp size={20} color="white" />
        </Button>
        <nav>
          <ul>
            <li>
              <Link
                href={`/`} 
                className="flex items-center justify-center h-14 hover:bg-neutral-700 transition-colors duration-200"
              >
                <span className="text-xl">
                  <IoHome/>
                  </span>
                {isSidebarOpen && <span className="ml-3">Inicio</span>}
              </Link>
            </li>
            {items.map((item, index) => (
              <li key={index}>
                <Link 
                  href={`/pages/${item.link}`} 
                  className="flex items-center justify-center h-14 hover:bg-neutral-700 transition-colors duration-200"
                >
                  <span className="text-xl">{item.icon}</span>
                  {isSidebarOpen && <span className="ml-3">{item.title}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 ${
        isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`} onClick={() => setIsSidebarOpen(false)}></div>
    </>
  )
}