
import React from 'react';
import { User, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Toggle } from '@/components/ui/toggle';

const Navbar = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { profile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  // Get initials from full name
  const getInitials = (name: string = 'User') => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
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
            <span>{profile?.xp || 0}</span>
          </div>
          <div className="w-0.5 h-4 bg-border"></div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium">Level:</span>
            <span>{profile?.level || 1}</span>
          </div>
        </div>
        
        <Toggle 
          aria-label="Toggle theme" 
          pressed={theme === 'dark'} 
          onPressedChange={toggleTheme}
        >
          {theme === 'dark' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Toggle>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-campus-purple text-white">
                  {getInitials(profile?.full_name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium leading-none">{profile?.full_name || 'User'}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {profile?.email || ''}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
