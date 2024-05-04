import CreateProjectDialog from '@/components/projects/CreateProjectDialog';
import MyNavbar from '@/components/Navbar';
import ProjectCard from '@/components/ProjectCard';
import { Input } from '@/components/ui/input';
import server from '@/lib/utils';
import { AxiosError } from 'axios';
import { destroyCookie, parseCookies } from 'nookies';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { Project } from './manageProjectData';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [projects, setProjects] = useState<Array<Project>>([]);
  const [debouncedProjects, setDebouncedProjects] = useState<Array<Project>>(
    []
  );
  const [token] = useState<string | null>(parseCookies().userToken || null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      toast.warning('Please Login to Continue');
      return;
    }
    fetchProjects();
    checkAdmin();
  }, [token, navigate]);

  useEffect(() => {
    if (!debouncedSearch) {
      setDebouncedProjects(projects);
    }

    const filterdProjects = projects.filter(
      project =>
        project.slug.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        project.projectName
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        project.projectDesc
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase())
    );

    setDebouncedProjects(filterdProjects);
  }, [projects, debouncedSearch]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = search;
    }
  }, [search]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 350);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [search]);

  function handleSearch() {
    setSearch(inputRef.current?.value || '');
  }

  const fetchProjects = async () => {
    try {
      const res = await server.get('/api/project/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200) {
        console.error('Unexpected Response from Server', res.status);
        toast.error('Unexpected Response from Server');
        return;
      }

      const data = res.data;
      setProjects(data);
      setIsVerified(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          destroyCookie(null, 'userToken');
          toast.warning('Token Expired. Logging Out!');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
          return;
        }
        if (error.response?.status === 401) {
          toast.warning('Please Re-Login. Token Expired!');
          return;
        }
        if (error.response?.status === 403) {
          toast.warning('Contact Admin! Unverified!', {
            description: 'Your account is not verified yet',
          });

          return;
        }
        const err = error.response?.data.message || 'Something went wrong';
        toast.error(err);
        return;
      }

      console.error('Unexpected Response from Server', error);
    }
  };

  const checkAdmin = async () => {
    const res = await server.get('/api/admin/check', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status === 200) {
      setIsAdmin(true);
    }
  };

  function displayProjectCards(): React.ReactNode {
    return (
      <div className="flex flex-col items-center">
        {projects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full mx-auto">
            {debouncedProjects.map((project: Project) => {
              return (
                <ProjectCard
                  key={project.slug}
                  slug={project.slug}
                  projectName={project.projectName}
                  projectDesc={project.projectDesc || ''}
                  projectData={project.projectData?.length || 0}
                  updatedAt={project.updatedAt}
                  setProjects={setProjects}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center space-y-2">
            <div className="text-4xl opacity-50">
              {debouncedSearch
                ? `No Projects with ${debouncedSearch} Found`
                : 'No Projects Created Yet!'}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <MyNavbar projectName="" />
      {isVerified && (
        <main className="flex min-h-screen bg-gray-200/40 flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 dark:bg-gray-800/40">
          <div className="max-w-6xl w-full mx-auto flex items-center gap-4">
            <Input
              className="shadow-md bg-white dark:bg-gray-950"
              onChange={handleSearch}
              ref={inputRef}
              placeholder="Search projects..."
            />
            {isAdmin && <CreateProjectDialog setProjects={setProjects} />}
          </div>
          {displayProjectCards()}
        </main>
      )}
      <footer className="p-5 text-center bg-white dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-400">
          © 2023 by HarshPatel5940. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
