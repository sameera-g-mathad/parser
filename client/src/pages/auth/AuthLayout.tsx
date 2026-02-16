import { LogoSvg } from "@/svgs";
import React from "react";
import { Outlet, useLocation } from "react-router-dom";

/**
 * 
 * @returns A JSX component that renders a common page like SignUp, SignIn part
 * of nested routes along with some common UI functionalities. 
 */
export const AuthLayout: React.FC = () => {
    const location = useLocation();
    // Adding colors for visuals.
    const getColor = (): string => {
        switch (location.pathname) {
            case '/auth/sign-in': return 'bg-indigo-200';
            case '/auth/sign-up': return 'bg-pink-200';
            case '/auth/forgot-password': return 'bg-orange-200';
            default: return 'bg-fuchsia-200'
        }
    }
    return <div className={`w-full h-screen grid grid-cols-12`}>
        <div className="sm:col-span-6 col-span-full">
            {/*Need to be present for the components of nested routes to be displayed
            by the react-router-dom */}
            <Outlet />
        </div>

        <div className={`sm:col-start-7 sm:col-span-full sm:flex justify-center items-center  hidden  m-3 rounded-lg ${getColor()}`}>
            <LogoSvg className="w-50 h-50 fill-white!" />
        </div>
    </div>;
};
