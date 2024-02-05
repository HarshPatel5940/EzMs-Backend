import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeftCircleIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import server, { cn } from '@/lib/utils';
import { AxiosError } from 'axios';

export default function SignupPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setErrors] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors('');
    setIsLoading(true);
    if (!email.trim() && !password.trim() && !name.trim() && !confirmPassword.trim()) {
      setErrors('Please fill all the fields');
      setIsLoading(false);
      return;
    }
    if (password.trim() !== confirmPassword.trim()) {
      setErrors('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const res = await server.post('/api/auth/signup', {
        name,
        email,
        password,
      });

      if (res.status !== 201) {
        setErrors('Unexpected Response from Server, response code: ' + res.status);
        return;
      }
      navigate('/login');
      toast({
        title: 'Account Created',
        description: 'Please login to continue',
        type: 'foreground',
        className: cn('top-0 right-0 flex fixed md:max-w-[420px] md:top-20 md:right-4'),
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        const err = error.response?.data.message.issues[0].message || error.message;
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
        <Navbar />
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
              <h1 className="text-3xl font-bold">Sign Up</h1>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="flex flex-col gap-3 space-y-2">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      type="text"
                      value={name}
                      minLength={4}
                      maxLength={50}
                      onChange={handleNameChange}
                    />
                  </div>
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
                      <Input
                        id="confpwd"
                        placeholder="Confirm Password"
                        type="password"
                        minLength={6}
                        maxLength={100}
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button className=" text-white font-bold px-4 rounded" type="submit" disabled={isLoading}>
                    {isLoading ? 'Signing Up' : 'Sign Up'}
                  </Button>
                </div>
                {error && <span className="flex justify-center text-red-500 ">{error}</span>}
              </div>
            </form>
          </div>
        </div>
        <div className="flex justify-center ml-14">
          <Link to={'/login'}>
            <Button variant="link">Already a User? Login</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
