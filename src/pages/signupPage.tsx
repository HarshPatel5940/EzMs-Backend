import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';

export default function SignupPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div>
        <Navbar />
        <div className="flex flex-col min-h-screen bg-gray-100 justify-center">
          <div className="flex items-center justify-center z-10">
            <div className="flex flex-col flex-grow max-w-md rounded-lg shadow-lg bg-white p-6 space-y-3 border border-gray-200 dark:border-gray-700">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Sign Up</h1>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-3 space-y-2 TRA">
                  <div>
                    <Label htmlFor="email">Name</Label>
                    <Input id="text" placeholder="email@example.com" type="email" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="email@example.com" type="email" />
                  </div>
                  <div className="flex flex-col">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" placeholder="Password" type="password" minLength={8} />
                      <Input id="confpwd" placeholder="Confirm Password" type="password" minLength={8} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Link to={'/login'}>
              <Button variant="link">Already a User? Login</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
