import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import React from 'react'

const items = [
    {
        title: "Home",
        url: "#",
        icon: Home,
    },
    {
        title: "Staff",
        url: "#",
        icon: Inbox,
    },
    {
        title: "Calendar",
        url: "#",
        icon: Calendar,
    },
    // {
    //     title: "Search",
    //     url: "#",
    //     icon: Search,
    // },
    // {
    //     title: "Settings",
    //     url: "#",
    //     icon: Settings,
    // },
]

function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                Admin Dashboard
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {items.map(item => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <a href={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarContent>
        </Sidebar>
    )

}



function layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main>
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    )
}

export default layout