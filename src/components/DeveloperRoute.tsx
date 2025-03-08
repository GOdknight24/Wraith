
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DeveloperRoute = ({ children }: { children: JSX.Element }) => {
  const { isDeveloper, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="glass-card p-8 animate-pulse-soft">
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isDeveloper) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default DeveloperRoute;
