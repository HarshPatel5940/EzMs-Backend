import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MyNavbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeftCircleIcon } from 'lucide-react';
import server from '@/lib/utils';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
// todo: remove nookies and store it in session storage
import { parseCookies, setCookie } from 'nookies';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [error, setErrors] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [token] = useState<string | null>(parseCookies().userToken || null);

  useEffect(() => {
    if (token) {
      navigate('/projects');
    }
  }, []);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    if (event.target.value.length > 5) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors('');
    setIsLoading(true);
    if (!email.trim() && !password.trim()) {
      setErrors('Please fill all the fields');
      setIsLoading(false);
      return;
    }

    try {
      const res = await server.post('/api/auth/signin', {
        email,
        password,
      });

      if (res.status !== 200) {
        toast.warning('Unexpected Response from Server');
        setErrors('Unexpected Response from Server, response code: ' + res.status);
        return;
      }

      setCookie(null, 'userToken', res.data.accessToken, {
        maxAge: 3 * 24 * 60 * 60,
        path: '/',
      });

      toast.success('Logged In Successfully');
      navigate('/projects');
    } catch (error) {
      if (error instanceof AxiosError) {
        const err = error.response?.data.message || 'Something went wrong';
        setErrors(err);
        return;
      }
      setErrors('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div>
        <MyNavbar />
      </div>

      <div className="flex flex-col min-h-screen bg-gray-100 justify-center">
        <div className="flex items-center justify-center">
          <Link className="" to={'..'}>
            <Button variant="link">
              <ArrowLeftCircleIcon />
            </Button>
          </Link>
          <div
            className="flex flex-col flex-grow max-w-md rounded-lg shadow-lg bg-white 
           pl-8 pr-8 pt-6 pb-6  space-y-3 border border-gray-200 dark:border-gray-700"
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold">Login</h1>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="flex flex-col gap-3 space-y-2">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="Enter your email"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        placeholder="Enter your password"
                        type="password"
                        minLength={6}
                        maxLength={100}
                        value={password}
                        onChange={handlePasswordChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button
                    className=" text-white font-bold px-4 rounded"
                    type="submit"
                    disabled={isLoading || submitDisabled}
                  >
                    Login
                  </Button>
                </div>
                {error && <span className="flex justify-center text-red-500 ">{error}</span>}
              </div>
            </form>
          </div>
        </div>
        <div className="flex justify-center ml-14">
          <Link to={'/signup'}>
            <Button variant="link">Not a User? SignUp</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
