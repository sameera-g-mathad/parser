import React from "react";
import { Outlet, useLocation } from "react-router-dom";
export const AuthLayout: React.FC = () => {
    const location = useLocation();
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
            <Outlet />
        </div>

        <div className={`sm:col-start-7 sm:col-span-full hidden sm:block m-3 rounded-lg ${getColor()}`}>
        </div>
    </div>;
};
