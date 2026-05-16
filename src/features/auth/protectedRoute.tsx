import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

type ProtectedRouteProps = {
    children: ReactNode;
};

export function ProtectedRoute({children}: ProtectedRouteProps) {
    const { isSignedIn, isLoaded } = useAuth();
    const location = useLocation();

    if (!isLoaded) return null;

    if (!isSignedIn) {
        return <Navigate to="/login" replace state={{from: location}} />
    }

    return <>{children}</>
}
