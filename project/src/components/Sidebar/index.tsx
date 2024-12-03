"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import jwt from "jsonwebtoken";
import cookie from "js-cookie";
import ClickOutside from "@/components/ClickOutside";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

interface MenuGroup {
  name: string;
  menuItems: MenuItem[];
}

interface MenuItem {
  label: string;
  access: string;
  route: string;
}

const menuGroups: MenuGroup[] = [
  {
    name: "Dashboard",
    menuItems: [
      { label: "Stock", access: "admin", route: "/admin/dashboard" },
      { label: "Rekap Penghasilan", access: "admin", route: "/admin/rekap" },
      { label: "Pendapatan", access: "sales", route: "/sales/pendapatan" },
      { label: "Pengeluaran", access: "sales", route: "/sales/pengeluaran" },
      { label: "View", access: "customer", route: "/customers/tampilan" },
      { label: "Pesanan Saya", access: "customer", route: "/customers/pesanan" },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [userLevel, setUserLevel] = useState<string | null>(null); // State untuk level pengguna
  const token = cookie.get("token"); // Ambil token dari cookie

  useEffect(() => {
    console.log("Token:", token);
    if (token) {
      try {
        const decoded = jwt.decode(token) as { level: string } | null;
        if (decoded && decoded.level) {
          setUserLevel(decoded.level); // Set level pengguna
          console.log("Decoded Token:", decoded);
        } else {
          console.warn("Token does not contain a level field.");
        }
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    } else {
      console.warn("No token found.");
    }
  }, [token]);

  if (userLevel === null) {
    // Render kosong saat token sedang diambil
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading Sidebar...</p>
      </div>
    );
  }

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* Sidebar Menu */}
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            {menuGroups.map((group, groupIndex) => {
              // Filter menu items sesuai level pengguna
              const filteredItems = group.menuItems.filter(
                (item) => item.access === userLevel
              );

              // Render hanya jika ada item menu yang sesuai
              if (filteredItems.length === 0) {
                return null;
              }

              return (
                <div key={groupIndex}>
                  <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                    {group.name}
                  </h3>

                  <ul className="mb-6 flex flex-col gap-1.5">
                    {filteredItems.map((menuItem, menuIndex) => (
                      <li
                        key={menuIndex}
                        className={`rounded-lg px-4 py-2 text-white hover:bg-gray-700 ${
                          pathname === menuItem.route ? "bg-gray-700" : ""
                        }`}
                      >
                        <a href={menuItem.route}>{menuItem.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
