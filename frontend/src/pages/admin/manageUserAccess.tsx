import { Label, Separator } from '@radix-ui/react-dropdown-menu';
import MyNavbar from '../../components/Navbar';
import { destroyCookie, parseCookies } from 'nookies';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import server from '@/lib/utils';
import { AxiosError } from 'axios';
import { Card, CardContent } from '../../components/ui/card';
import { Switch } from '../../components/ui/switch';
import { Input } from '../../components/ui/input';

export default function ManageUserAccess() {
  const navigate = useNavigate();
  const [token] = useState<string | null>(parseCookies().userToken || null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [appUsers, setAppUsers] = useState<
    Array<{ email: string; name: string; role: string }>
  >([]);
  const [debouncedAppUsers, setDebouncedAppUsers] = useState<
    Array<{ email: string; name: string; role: string }>
  >([]);
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

  const handleSwitchSubmit = async (email: string, checked: boolean) => {
    setIsDisabled(true);

    try {
      const res = await server.patch(
        `/api/admin/${checked ? 'verify' : 'unverify'}/user`,
        {
          email,
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
      toast.success(
        `User ${checked ? 'verified' : 'unverified'} Successfully`,
        {
          description: email,
        }
      );
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
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <MyNavbar isAdmin={isAdmin} />
      <div className="flex flex-row w-full">
        {isAdmin ? (
          <main className="flex flex-col min-h-screen bg-gray-200/40 flex-1 gap-4 p-4 md:gap-8 md:p-10 dark:bg-gray-800/40">
            <div className="self-center space-y-5">
              <div className="text-2xl md:text-3xl font-bold ">
                Manage User Access
              </div>
              <div className="max-w-6xl w-full flex items-center gap-4">
                <Input
                  className="shadow-md bg-white dark:bg-gray-950"
                  onChange={handleSearch}
                  ref={inputRef}
                  placeholder="Search Users..."
                />
              </div>
              <div className="w-[60rem] flex-col space-y-5 items-center justify-center mt-8">
                <div className="flex flex-col gap-2">
                  <Label className="w-max">Manage Users</Label>
                  <div className="grid gap-3  grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {debouncedAppUsers?.map(
                      (user: { email: string; name: string; role: string }) => {
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
                                  disabled={
                                    isDisabled ||
                                    user.role.toLowerCase() === 'admin'
                                  }
                                  defaultChecked={
                                    user.role.toLowerCase() !== 'unverified'
                                  }
                                  onCheckedChange={(
                                    checked: boolean,
                                    email: string = user.email
                                  ) => {
                                    handleSwitchSubmit(email, checked);
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
                Manage User Access
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
