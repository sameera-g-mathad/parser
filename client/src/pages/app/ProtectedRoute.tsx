import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from '@/context/authContext'

/**
 * 
 * @returns A JSX Component that checks if the user is authenticated and 
 * reroutes to either protected routes or signIn page.
 */
export const ProtectedRoute: React.FC = () => {
    const { status } = useAuth();
    // If the status is false, it means the
    // user is not loggedIn or the jwt is expired,
    // or the user reset the password in another.
    if (!status)
        return <Navigate to="/auth/sign-in" replace={true} />

    return <Outlet />

}