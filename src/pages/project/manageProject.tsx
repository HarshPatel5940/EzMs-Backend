import MyNavbar from '@/components/Navbar';
import SideBar from '@/components/SideBar';
import type { ProjectData } from '@/components/projectDataCard';
import ResetProjectToken from '@/components/projects/TokenResetDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import server from '@/lib/utils';
import { AxiosError } from 'axios';
import { destroyCookie, parseCookies } from 'nookies';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export interface Project {
  slug: string;
  projectName: string;
  projectDesc: string;
  projectToken: string;
  projectData: ProjectData[];
  users: Array<{ email: string }>;
  createdAt: string;
  updatedAt: string;
}

export default function ManageProjectsPage() {
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [projectToken, setProjectToken] = useState<string>('');
  const [token] = useState<string | null>(parseCookies().userToken || null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const projectId = useParams().projectId;

  useEffect(() => {
    if (!token) {
      navigate('/login');
      toast.warning('Please Login to Continue');
      return;
    }
    fetchProjectData();
  }, [token, navigate]);

  const handleDisplayToken = (projectToken: string) => {
    return `**** **** **** **** **** **** **** **** ${projectToken.slice(-6)}`;
  };

  const fetchProjectData = async () => {
    try {
      const res = await server.get(`/api/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200) {
        console.error('Unexpected Response from Server', res.status);
        toast.error('Unexpected Response from Server');
        return;
      }

      const data = res.data as Project;
      data.projectData = [];
      setProject(data);
      setProjectToken(data.projectToken);
      setIsVerified(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          destroyCookie(null, 'userToken');
          navigate('/login');
          toast.warning('Please Login to Continue');
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

  return (
    <div className="flex flex-col w-full">
      <MyNavbar projectName={project?.projectName} />
      <div className="flex flex-row w-full">
        <SideBar baseUrl={`/project/${project?.slug}`} />
        {isVerified && (
          <main className="flex flex-col min-h-screen bg-gray-200/40 flex-1 gap-4 p-4 md:gap-8 md:p-10 dark:bg-gray-800/40">
            <div className="self-center">
              <div className="text-2xl md:text-3xl font-bold ">
                Manage Project Details
                <div className="text-sm md:text-base font-semibold text-gray-500 mt-2">
                  Project Slug: {project?.slug}
                </div>
              </div>

              <div className="w-[60rem] flex-col space-y-5 items-center justify-center mt-8">
                <div className=" flex flex-col gap-2">
                  <Label className="w-max">Project Name</Label>
                  <Input defaultValue={project?.projectName} />
                </div>
                <Separator />
                <div className=" flex flex-col gap-2">
                  <Label className="w-max">Project Description</Label>
                  <Input defaultValue={project?.projectDesc} />
                </div>
                <Separator />
                <div className="flex flex-col gap-2">
                  <Label className="w-max">Project Token</Label>
                  <div className="flex gap-2">
                    <Input
                      className="text-black font-semibold"
                      value={handleDisplayToken(projectToken)}
                      disabled={true}
                    />

                    <Button
                      onClick={() =>
                        navigator.clipboard.writeText(projectToken)
                      }
                    >
                      Copy
                    </Button>

                    <ResetProjectToken
                      projectSlug={project?.slug as string}
                      setProjectToken={setProjectToken}
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}
      </div>
      <footer className="p-5 text-center bg-white dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-400">
          © 2023 by HarshPatel5940. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
