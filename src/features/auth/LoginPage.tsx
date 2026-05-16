import { SignIn, useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (isLoaded && isSignedIn) {
    return <Navigate to="/members" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SignIn />
    </div>
  );
};

export default LoginPage;
