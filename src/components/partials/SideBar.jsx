'use client'

import ApplicationLogo from "@/components/Atoms/ApplicationLogo";
import NavLink from "@/components/Atoms/NavLink";
import { Badge } from "@/components/ui/badge";
import { useManualNotificationRefresh, useNotificationPolling } from "@/utility/SideBarNotification";
import renderIcon from "@/utility/renderIcon";
import Link from "next/link";
import { cn } from "@/lib/utils"
import axios from "@/lib/axios";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";

const SideBar = ({ color, userRole }) => {
  const pathname = usePathname();
  const routes = useNotificationPolling(userRole);
  const manualRefresh = useManualNotificationRefresh();

  const clearNotification = async (e, jenis) => {
    e.preventDefault();

    try {
      await axios.delete('/api/notification/clear', {
        data: { jenis }, 
      });

      await manualRefresh(userRole)

    } catch (error) {
      console.error("Error clearing notification:", error);
    }
  };

  // Fungsi untuk memeriksa apakah route aktif
  const isActive = (route) => {
    if (route === "dashboard") {
      return pathname === `/${userRole === "PejabatRT" ? "rt" : userRole === "PejabatRW" ? "rw" : userRole.toLowerCase()}`;
    }
    return pathname === `/${userRole === "PejabatRT" ? "rt" : userRole === "PejabatRW" ? "rw" : userRole.toLowerCase()}/${route}` || pathname.startsWith(`/${userRole === "PejabatRT" ? "rt" : userRole === "PejabatRW" ? "rw" : userRole.toLowerCase()}/${route}/`);
  };

  // Fungsi untuk mendapatkan URL
  const getUrl = (route) => {
    if (route === "dashboard") {
      return `/${userRole === "PejabatRT" ? "rt" : userRole === "PejabatRW" ? "rw" : userRole.toLowerCase()}`;
    }
    
    if (userRole === "Warga") {
      if (route === "pengajuan" || route === "histori" || route === "akun" || route === "bantuan") {
        return `/warga/${route}`;
      }
      return "/warga";
    }

    if (userRole === "PejabatRT") {
      if (route === "pengajuan-masalah" || route === "rekap-pengajuan" || route === "bantuan") {
        return `/rt/${route}`;
      }
      return "/rt";
    }

    if (userRole === "PejabatRW") {
      if (route === "pengajuan-masalah" || route === "rekap-pengajuan" || route === "bantuan") {
        return `/rw/${route}`;
      }
      return "/rw";
    }

    if (userRole === "Admin") {
      if (route === "biodata-user" || route === "rekap-pengajuan" || route === "approval-role" || route === "tambah-rtrw") {
        return `/admin/${route}`;
      }
      return "/admin";
    }
    
    return `/${route}`;
  };

  return (
      <>
          <div className="hidden border-r bg-muted/40 md:block">
              <div className="flex h-full max-h-screen flex-col gap-2">
                  <div className="flex h-14 justify-center items-center px-4 lg:h-[60px] lg:px-6">
                      <Link href="/">
                          <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                      </Link>
                  </div>
                  <div className="flex-1">
                      <nav className="grid items-start text-sm font-medium">
                          {routes.map((data, index) => (
                              <NavLink
                                  key={index}
                                  href={getUrl(data.route)}
                                  active={isActive(data.route)}
                                  className=""
                                  color={color}
                              >
                                  {renderIcon(data.icon)}
                                  {data.name}
                                  {data.notification > 0 && (
                                      <Badge
                                          onClick={(e) =>
                                              clearNotification(e, data.jenis)
                                          }
                                          color={color}
                                          className="group ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                                      >
                                          <span className="group-hover:hidden">
                                              {data.notification}
                                          </span>
                                          <span className="hidden group-hover:block">
                                              <X className="p-1" />
                                          </span>
                                      </Badge>
                                  )}
                              </NavLink>
                          ))}
                      </nav>
                  </div>
                  <div className="mt-auto p-4"></div>
              </div>
          </div>

          <div className="fixed z-20 block md:hidden bottom-0 left-0 right-0 bg-white border-t border-gray-200">
              <nav className="flex">
                  {routes.map((data, index) => (
                      <Link
                          key={index}
                          href={getUrl(data.route)}
                          className={cn(
                              "flex flex-col items-center justify-center flex-1 py-2 px-1",
                              "transition-colors duration-200 ease-in-out",
                              isActive(data.route)
                                  ? `text-${color} bg-${color}-50`
                                  : "text-gray-600 hover:bg-gray-50"
                          )}
                      >
                          {renderIcon(data.icon, 6)}
                          <span className="text-xs text-center font-medium">
                              {data.name}
                          </span>
                      </Link>
                  ))}
              </nav>
          </div>
      </>
  );
}

export default SideBar