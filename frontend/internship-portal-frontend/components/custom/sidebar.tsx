'use client';

import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  Building2,
  BookOpen,
  Users,
  Search,
  FileText,
  PlusCircle,
  BarChart3,
  Settings,
  Home,
  CheckCircle,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const getNavigationItems = () => {
    switch (user.role) {
      case 'STUDENT':
        return [
          {
            title: 'Find Internships',
            href: '/student/offers',
            icon: Search,
          },
          {
            title: 'My Applications',
            href: '/student/applications',
            icon: FileText,
          },
        ];
      case 'COMPANY':
        return [
          {
            title: 'Dashboard',
            href: '/company/dashboard',
            icon: Home,
          },
          {
            title: 'Manage Offers',
            href: '/company/offers',
            icon: FileText,
          },
          {
            title: 'Create Offer',
            href: '/company/offers/new',
            icon: PlusCircle,
          },
        ];
      case 'TEACHER':
        return [
          {
            title: 'Validate Agreements',
            href: '/teacher/agreements',
            icon: CheckCircle,
          },
        ];
      case 'ADMIN':
        return [
          {
            title: 'Dashboard',
            href: '/admin/dashboard',
            icon: BarChart3,
          },
          {
            title: 'User Management',
            href: '/admin/users',
            icon: Users,
          },
          {
            title: 'Reports',
            href: '/admin/reports',
            icon: FileText,
          },
        ];
      default:
        return [];
    }
  };

  const getRoleIcon = () => {
    switch (user.role) {
      case 'STUDENT':
        return GraduationCap;
      case 'COMPANY':
        return Building2;
      case 'TEACHER':
        return BookOpen;
      case 'ADMIN':
        return Settings;
      default:
        return Users;
    }
  };

  const navigationItems = getNavigationItems();
  const RoleIcon = getRoleIcon();

  return (
    <div className={cn('pb-12 w-64', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center mb-4">
            <RoleIcon className="h-6 w-6 mr-2 text-primary" />
            <h2 className="text-lg font-semibold tracking-tight">
              {user.role.charAt(0) + user.role.slice(1).toLowerCase()} Portal
            </h2>
          </div>
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Button
                  key={item.href}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    isActive && 'bg-secondary'
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <Icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
