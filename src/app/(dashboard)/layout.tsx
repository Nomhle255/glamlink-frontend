import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboards/app-sidebar"

export default function dashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-h-screen w-full">
          <SidebarTrigger />
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}