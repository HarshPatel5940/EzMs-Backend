import Navbar from '@/components/navbar';

export default function ErrorPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <section className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900" id="hero">
          <div className="text-center space-y-2">
            <h1 className="text-9xl font-bold text-gray-800 dark:text-white">Aien? 404</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400"> We did not found the page you are looking for</p>
          </div>
        </section>
      </main>
      <footer className="p-5 text-center bg-white dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-400">© 2023 by HarshPatel5940. All rights reserved.</p>
      </footer>
    </div>
  );
}
