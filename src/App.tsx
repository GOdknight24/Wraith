
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProfileProvider } from "./contexts/ProfileContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/dashboard/Home";
import ProfileLinks from "./pages/dashboard/ProfileLinks";
import Appearance from "./pages/dashboard/Appearance";
import Audio from "./pages/dashboard/Audio";
import Settings from "./pages/dashboard/Settings";
import BiolinkPage from "./pages/BiolinkPage";
import DeveloperPortal from "./pages/DeveloperPortal";
import NotFound from "./pages/NotFound";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import DeveloperRoute from "./components/DeveloperRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProfileProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Dashboard Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
                <Route index element={<Home />} />
                <Route path="links" element={<ProfileLinks />} />
                <Route path="appearance" element={<Appearance />} />
                <Route path="audio" element={<Audio />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              
              {/* Developer Portal */}
              <Route 
                path="/developer" 
                element={
                  <DeveloperRoute>
                    <DeveloperPortal />
                  </DeveloperRoute>
                } 
              />
              
              {/* Public Biolink Page */}
              <Route path="/:username" element={<BiolinkPage />} />
              
              {/* Redirect root to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ProfileProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
