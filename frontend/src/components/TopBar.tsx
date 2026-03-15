"use client";

import { useState, useEffect } from 'react';
import { Bell, HelpCircle, Moon, Sun, LogOut, User, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLocale } from '../contexts/LocaleContext';
import { logoutAction } from '@/actions/auth'; // Adjust path if necessary
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

// Why: Shrink the required props to only the data the Server Layout actually has.
interface TopBarProps {
  currentTenant: string;
  currentRole: string;
  userName: string;
}

export function TopBar({
  currentTenant,
  currentRole,
  userName,
}: TopBarProps) {
  const { t } = useLocale();

  // Why: Internalize the state that used to be managed by the parent SPA wrapper.
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [dateRange, setDateRange] = useState('30d');
  const [activeTenant, setActiveTenant] = useState(currentTenant);
  const [activeRole, setActiveRole] = useState(currentRole);

  // Why: Handle the theme DOM manipulation directly within this client component.
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
        <Select value={activeTenant} onValueChange={setActiveTenant}>
          <SelectTrigger className="w-[200px] bg-input-background border-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FiberFast ISP">FiberFast ISP</SelectItem>
            <SelectItem value="SkyLine Net">SkyLine Net</SelectItem>
            <SelectItem value="BayLink Broadband">BayLink Broadband</SelectItem>
            <SelectItem value="MetroFiber">MetroFiber</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[140px] bg-input-background border-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="search"
            placeholder="Search..."
            className="w-[280px] h-9 px-3 rounded-lg bg-input-background border-0 placeholder:text-muted-foreground"
          />
        </div>

        <Select value={activeRole} onValueChange={setActiveRole}>
          <SelectTrigger className="w-[160px] bg-input-background border-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SuperAdmin">Super Admin</SelectItem>
            <SelectItem value="SystemAdmin">System Admin</SelectItem>
            <SelectItem value="Technician">Technician</SelectItem>
            <SelectItem value="Support">Support</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" size="icon" onClick={handleThemeToggle} title={t.topBar.toggleTheme}>
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>

        <LanguageSwitcher />

        <Button variant="ghost" size="icon" className="relative" title={t.topBar.notifications}>
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 pl-2 border-l border-border h-auto py-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="leading-none text-foreground">{userName}</span>
                <span className="text-muted-foreground leading-none text-xs">{activeRole}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground">{activeRole}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>View Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Account Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
              // Why: Directly invoke the Server Action to clear the cookie and redirect to /login.
              onClick={() => logoutAction()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}