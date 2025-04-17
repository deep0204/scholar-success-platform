
import React from 'react';
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Mock user data - in reality this would come from Supabase auth
  const user = {
    name: 'Student User',
    email: 'student@example.com',
    initials: 'SU',
    xp: 75,
    level: 1
  };

  return (
    <header className="border-b h-14 flex items-center px-4 md:px-6 sticky top-0 z-30 bg-background">
      <div className="flex items-center gap-2">
        {isMobile && <SidebarTrigger />}
      </div>
      
      <div className="ml-auto flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted/60 rounded-full text-sm">
          <div className="flex items-center gap-1.5">
            <span className="font-medium">XP:</span> 
            <span>{user.xp}</span>
          </div>
          <div className="w-0.5 h-4 bg-border"></div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium">Level:</span>
            <span>{user.level}</span>
          </div>
        </div>
        
        <Button size="icon" variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-campus-pink"></span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-campus-purple text-white">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/')}>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
