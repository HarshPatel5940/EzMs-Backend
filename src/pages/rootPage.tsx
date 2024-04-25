import MyNavbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function homePage() {
  return (
    <div>
      <MyNavbar />
      <main className="flex-grow z-0 -mt-16">
        <section
          className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900"
          id="hero"
        >
          <div className="text-center space-y-2">
            <h1 className="text-9xl font-bold text-gray-800 dark:text-white">
              EzMs
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {' '}
              A Simple yet Robust CMS.
            </p>
            <Link to={'/signup'}>
              <Button variant="link">Get Started. SignUp</Button>
            </Link>
          </div>
        </section>
      </main>
      <footer className="p-5 text-center bg-white dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-400">
          © 2023 by HarshPatel5940. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
