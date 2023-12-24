import { Link } from 'react-router-dom';

interface NavbarProps {
  text?: string;
  showLoginButton?: boolean;
}

export default function Navbar({ text, showLoginButton }: NavbarProps) {
  if (text === undefined) text = '';
  if (showLoginButton === undefined) showLoginButton = false;

  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 max-h-16 sticky z-10">
      <div>
        <a href="/" className="flex space-x-4">
          <img src="./vite.svg" className="h-8 w-8 text-gray-800 dark:text-white" />
          <span className="text-xl">{text}</span> {/* Display the user inputted text near the logo */}
        </a>
      </div>
      <nav className="space-x-4 text-xl">
        {showLoginButton && (
          <Link
            to="/login"
            className="text-gray-600 hover:text-gray-800 dark:text-white dark:hover:text-gray-300 hover:font-bold"
          >
            Login
          </Link>
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
