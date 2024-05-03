import { Link, useNavigate } from 'react-router-dom';
import { destroyCookie, parseCookies } from 'nookies';

import {
  BreadcrumbLink,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbList,
  Breadcrumb,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from '@/components/ui/dropdown-menu';
import { UserIcon, LogOutIcon } from 'lucide-react';
import { type ReactNode, useState } from 'react';

interface NavbarProps {
  projectName?: string;
}

export default function MyNavbar({ projectName }: NavbarProps) {
  const navigate = useNavigate();
  const [token] = useState<string | null>(parseCookies().userToken || null);

  const handleLogout = () => {
    destroyCookie(null, 'userToken');
    navigate('/login');
  };

  const handleBreadcrumb = () => {
    const pathUrl = window.location.pathname.split('/');
    const list: ReactNode[] = [];

    if (pathUrl[1].startsWith('project')) {
      list.push(
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/projects"
            className="text-gray-600 hover:text-gray-800 dark:text-white dark:hover:text-gray-300 hover:font-bold"
          >
            Projects
          </BreadcrumbLink>
        </BreadcrumbItem>
      );
    }

    if (projectName) {
      list.push(
        <BreadcrumbSeparator className="text-gray-500" />,
        <BreadcrumbItem>
          <BreadcrumbLink
            href={`/project/${pathUrl[2]}`}
            className="text-gray-600 hover:text-gray-800 dark:text-white dark:hover:text-gray-300 hover:font-bold"
          >
            {projectName}
          </BreadcrumbLink>
        </BreadcrumbItem>
      );
    }
    return (
      <Breadcrumb>
        <BreadcrumbList>{...list}</BreadcrumbList>
      </Breadcrumb>
    );
  };

  const handleDropdown = () => {
    if (token) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-8 w-8 p-0 rounded-full" variant="outline">
              {/* // TODO: Shift to using the user acc icon later */}
              <UserIcon className="h-5 w-5 text-gray-400" />
              <span className="sr-only">User Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={handleLogout}>
              <LogOutIcon className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return (
      <Link
        to="/login"
        className="text-gray-600 hover:text-gray-800 dark:text-white dark:hover:text-gray-300 hover:font-bold"
      >
        Login
      </Link>
    );
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 max-h-14 sticky z-10">
      <nav className="flex items-center">{handleBreadcrumb()}</nav>
      <div className="flex items-center gap-4">
        <Link to="https://github.com/HarshPatel5940/ezms-frontend">
          <img src="/github.svg" alt="GitHub" className="w-8 h-8" />
        </Link>
        {handleDropdown()}
      </div>
    </header>
  );
}
