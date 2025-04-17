
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Sidebar as SidebarComponent, 
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { Home, GraduationCap, Users, Video, MessageSquare, Award, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'College Explorer', path: '/colleges', icon: GraduationCap },
    { name: 'Mentor Connect', path: '/mentors', icon: Users },
    { name: 'Career Videos', path: '/videos', icon: Video },
    { name: 'Career Coach', path: '/career-coach', icon: MessageSquare },
    { name: 'Scholarships', path: '/scholarships', icon: Award },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  ];

  return (
    <SidebarComponent>
      <SidebarHeader className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-campus-blue flex items-center justify-center">
            <span className="text-white font-bold">CC</span>
          </div>
          <span className="font-bold text-lg text-foreground">CampusConnect</span>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.path} 
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/50"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarComponent>
  );
};

export default Sidebar;
