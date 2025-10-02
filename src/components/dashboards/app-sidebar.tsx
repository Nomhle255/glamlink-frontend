

import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Inbox, LayoutDashboard, Calendar, Search, User, LogOut } from "lucide-react"

// Menu items with real URLs.
import { CreditCard } from "lucide-react";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Services",
    url: "/dashboard/services",
    icon: Search,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Bookings",
    url: "/dashboard/booking",
    icon: Inbox,
  },
  {
    title: "Payment Method",
    url: "/dashboard/payment-method",
    icon: CreditCard,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Logout",
    url: "/logout",
    icon: LogOut,
  },
]

export function AppSidebar({ bookingsCount }: { bookingsCount?: number }) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, idx) => {
                let notification = null;
                if (item.title === "Bookings" && typeof bookingsCount === 'number' && bookingsCount > 0) {
                  notification = bookingsCount;
                }
                return (
                  <SidebarMenuItem key={item.title + '-' + idx}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className="flex items-center gap-2">
                        <item.icon />
                        <span>{item.title}</span>
                        {notification !== null && (
                          <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-pink-500 rounded-full">
                            {notification}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}