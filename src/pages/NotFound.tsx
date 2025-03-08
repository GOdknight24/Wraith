
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-zinc-900">
      <div className="glass-card p-8 text-center max-w-md w-full">
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-white/70 mb-6">Oops! Page not found</p>
        <Link 
          to="/" 
          className="inline-block bg-wraith-accent hover:bg-wraith-hover text-white px-4 py-2 rounded-lg transition-all duration-200"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
