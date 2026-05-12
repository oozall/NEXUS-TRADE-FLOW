import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { EngineProvider } from '@/lib/engineContext';
import { ModeScoringProvider } from '@/lib/modeScoringContext';
import AppLayout from '@/components/layout/AppLayout';

// Page imports
import Dashboard from '@/pages/Dashboard';
import Positions from '@/pages/Positions';
import Signals from '@/pages/Signals';
import Market from '@/pages/Market';
import Performance from '@/pages/Performance';
import Settings from '@/pages/Settings';
import Logs from '@/pages/Logs';
import Strategies from '@/pages/Strategies';
import UserStrategies from '@/pages/UserStrategies';
import AdaptiveMode from '@/pages/AdaptiveMode';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">FX</span>
          </div>
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') return <UserNotRegisteredError />;
    if (authError.type === 'auth_required') { navigateToLogin(); return null; }
  }

  return (
    <EngineProvider>
      <ModeScoringProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/positions" element={<Positions />} />
            <Route path="/signals" element={<Signals />} />
            <Route path="/market" element={<Market />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/strategies" element={<Strategies />} />
            <Route path="/user-strategies" element={<UserStrategies />} />
            <Route path="/adaptive-mode" element={<AdaptiveMode />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </AppLayout>
      </ModeScoringProvider>
    </EngineProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;