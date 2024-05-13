import { Label, Separator } from '@radix-ui/react-dropdown-menu';
import MyNavbar from '../../components/Navbar';
import SideBar from '../../components/SideBar';
import { destroyCookie, parseCookies } from 'nookies';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import server from '@/lib/utils';
import type { Project } from '@/pages/project/manageProjectData';
import { AxiosError } from 'axios';
import { Card, CardContent } from '../../components/ui/card';
import { Switch } from '../../components/ui/switch';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

export default function ManageProjectAccess() {
  const navigate = useNavigate();
  const projectId = useParams().projectId;
  const [token] = useState<string | null>(parseCookies().userToken || null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [project, setProject] = useState<Project>();
  const [projectUsers, setProjectUsers] = useState<string[]>([]);
  const [appUsers, setAppUsers] = useState<
    Array<{ email: string; name: string }>
  >([]);
  const [debouncedAppUsers, setDebouncedAppUsers] = useState<
    Array<{ email: string; name: string }>
  >([]);
  const [addAccess, setAddAccess] = useState<string[]>();
  const [removeAccess, setRemoveAccess] = useState<string[]>();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      toast.warning('Please Login to Continue');
      return;
    }
    checkAdmin();
    fetchAllUsers();
    fetchProjectData();
  }, [token, navigate]);

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

  useEffect(() => {
    if (!debouncedSearch) {
      setDebouncedAppUsers(appUsers);
      return;
    }

    const filteredUsers = appUsers.filter(
      user =>
        user.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        user.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    setDebouncedAppUsers(filteredUsers);
  }, [debouncedSearch, appUsers]);

  function handleSearch() {
    setSearch(inputRef.current?.value || '');
  }

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

  const fetchAllUsers = async () => {
    try {
      const res = await server.get('/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAppUsers(res.data.data);
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
      setProject(data);
      const users = data.users.map(user => user.email);
      setProjectUsers(users);
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

  const handleSubmit = async () => {
    try {
      if (!addAccess && !removeAccess) {
        toast.warning('No Changes Detected');
        return;
      }

      console.log('added', addAccess);
      console.log('removed', removeAccess);
      const res = await server.patch(
        `/api/project/${projectId}/access`,
        {
          AddAccess: addAccess,
          RemoveAccess: removeAccess,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status !== 200) {
        console.error('Unexpected Response from Server', res.status);
        toast.error('Unexpected Response from Server');
        return;
      }

      setAddAccess([]);
      setRemoveAccess([]);
      toast.success('User Access Updated Successfully');
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

  const handleSwitch = (checked: boolean, email: string) => {
    if (checked) {
      setAddAccess(prev => {
        if (!prev) {
          return [email];
        }
        return [...prev, email];
      });
      setRemoveAccess(prev => {
        if (!prev) {
          return [];
        }
        return prev.filter(u => u !== email);
      });
    } else {
      setAddAccess(prev => {
        if (!prev) {
          return [];
        }
        return prev.filter(u => u !== email);
      });
      setRemoveAccess(prev => {
        if (!prev) {
          return [email];
        }
        return [...prev, email];
      });
    }
  };

  return (
    <div className="flex flex-col w-full">
      <MyNavbar projectName={project?.projectName} />
      <div className="flex flex-row w-full">
        <SideBar baseUrl={`/project/${project?.slug}`} />
        {isAdmin ? (
          <main className="flex flex-col min-h-screen bg-gray-200/40 flex-1 gap-4 p-4 md:gap-8 md:p-10 dark:bg-gray-800/40">
            <div className="self-center space-y-5">
              <div className="text-2xl md:text-3xl font-bold ">
                Manage Project User Access
                <div className="text-sm md:text-base font-semibold text-gray-500 mt-2">
                  Project Slug: {project?.slug}
                </div>
              </div>
              <div className="max-w-6xl w-full flex items-center gap-4">
                {/* // TODO: implement search functionality */}
                <Input
                  className="shadow-md bg-white dark:bg-gray-950"
                  onChange={handleSearch}
                  ref={inputRef}
                  placeholder="Search Users..."
                />
                <Button className="shadow-md" onClick={handleSubmit}>
                  Save Changes
                </Button>
              </div>
              <div className="w-[60rem] flex-col space-y-5 items-center justify-center mt-8">
                <div className="flex flex-col gap-2">
                  <Label className="w-max">Manage Users</Label>
                  <div className="grid gap-3  grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {debouncedAppUsers?.map(
                      (user: { email: string; name: string }) => {
                        return (
                          <Card key={user.email}>
                            <CardContent className="mt-5">
                              <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                  <div className="text-lg font-semibold">
                                    {user.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {user.email}
                                  </div>
                                </div>
                                <Switch
                                  key={user.email}
                                  defaultChecked={projectUsers.includes(
                                    user.email
                                  )}
                                  onCheckedChange={(
                                    checked: boolean,
                                    email: string = user.email
                                  ) => {
                                    handleSwitch(checked, email);
                                  }}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        );
                      }
                    )}
                  </div>
                </div>
                <Separator />
              </div>
            </div>
          </main>
        ) : (
          <main className="flex flex-col min-h-screen bg-gray-200/40 flex-1 gap-4 p-4 md:gap-8 md:p-10 dark:bg-gray-800/40">
            <div className="self-center">
              <div className="text-2xl md:text-3xl font-bold ">
                Manage Project User Access
                <div className="text-sm md:text-base font-semibold text-gray-500 mt-2">
                  Project Slug: {project?.slug}
                </div>
              </div>

              <div className="flex justify-center align-middle items-center">
                <div className="text-2xl md:text-3xl font-bold ">
                  You are not an Admin
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
