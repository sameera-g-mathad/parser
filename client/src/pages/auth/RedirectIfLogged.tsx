import { useAuth } from "@/context/authContext";
import { Navigate, Outlet } from "react-router-dom";

/**
 * 
 * @returns A JSX Wrapper Component that reroutes users to
 * home page or any auth pages based on their loggedIn status.
 */
export const RedirectIfLogged: React.FC = () => {
    const { status } = useAuth()

    // Check if the user tries to access any
    // route that is outside of protedted Route,
    // i.e, if they try to access sign-in/sign-up routes
    // even after loggedIn, then reroute them back to home page.
    if (status) {
        return <Navigate to="/app/dashboard" replace={true} />
    }

    return <Outlet />
};
