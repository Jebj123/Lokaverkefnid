import { type ReactNode } from "react";
import { useAuth, RedirectToSignUp } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";

type ProtectedRouteProps = {
    children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isSignedIn, isLoaded } = useAuth();
    const location = useLocation();

    // Bypass auth gate during Cypress E2E tests
    if (typeof (window as unknown as { Cypress?: unknown }).Cypress !== 'undefined') {
        return <>{children}</>;
    }

    if (!isLoaded) return null;

    if (!isSignedIn) {
        sessionStorage.setItem('redirectAfterAuth', location.pathname);
        return <RedirectToSignUp />;
    }

    return <>{children}</>;
}
