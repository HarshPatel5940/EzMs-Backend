import { Link, useNavigate } from 'react-router-dom';
import { destroyCookie } from 'nookies';

interface NavbarProps {
  text?: string;
  showLoginButton?: boolean;
}
// todo: remake navbar with breadcrumbs and different way
export default function MyNavbar({ text, showLoginButton }: NavbarProps) {
  const navigate = useNavigate();
  if (text === undefined) text = '';
  if (showLoginButton === undefined) showLoginButton = false;

  const handleLogout = () => {
    navigate('/login');
    destroyCookie(null, 'userToken');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 max-h-16 sticky z-10">
      <div>
        <a href="/" className="flex space-x-4">
          <img src="./vite.svg" className="h-8 w-8 text-gray-800 dark:text-white" alt="" />
          {/* TODO: Make a own logo and then replace this */}
          {/* // todo: Add shadCn BreadCrumb */}
          <span className="text-xl">{text}</span> {/* Display the user inputted text near the logo */}
        </a>
      </div>
      <nav className="space-x-4 text-xl">
        {showLoginButton ? (
          <Link
            to="/login"
            className="text-gray-600 hover:text-gray-800 dark:text-white dark:hover:text-gray-300 hover:font-bold"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-800 dark:text-white dark:hover:text-gray-300 hover:font-bold"
          >
            Logout
          </button>
        )}
        <a
          className="text-gray-600 hover:text-gray-800 dark:text-white dark:hover:text-gray-300 hover:font-bold"
          href="https://github.com/HarshPatel5940/ezms-frontend"
        >
          Github
        </a>
      </nav>
    </header>
  );
}
