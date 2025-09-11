import React, { type PropsWithChildren } from "react";
import type { className } from "@/interface";
import type { authFormInterface } from "@/interface";
import { LogoSvg } from "@/svgs";

/**
 * React component that is used in auth flow to display the logo, title of each
 * page and a description.
 * @param children Children here are Signup, SignIn, ForgotPassword, ResetPassword.
 * @param className Tailwind classes in string, to set the styles.
 * @param description String to display a message in each page.
 * @param title String to display title of what is done in the current page.
 * @returns A JSX element containing the auth layout with logo, title, description, and children.
 */
export const AuthForm: React.FC<PropsWithChildren & authFormInterface & className> = ({ children, className, description, title }) => {
    return <div className="h-screen flex flex-col justify-center items-center">
        <LogoSvg className={`w-16 h-16 ${className}`} />
        <p className="font-semibold tracking-wider py-3 text-4xl">{title}</p>
        <p>{description}</p>
        {children}
    </div>;
};
