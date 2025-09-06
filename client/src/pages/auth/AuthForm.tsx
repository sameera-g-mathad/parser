import React, { type PropsWithChildren } from "react";
import type { className } from "../../interface";
import { LogoSvg } from "../../svgs";

interface authFormInterface {
    title: string;
    description: string;
}
export const AuthForm: React.FC<PropsWithChildren & authFormInterface & className> = ({ children, className, description, title }) => {
    return <div className="h-screen flex flex-col justify-center items-center">
        <LogoSvg className={`w-16 h-16 ${className}`} />
        <p className="font-semibold tracking-wider py-3 text-4xl">{title}</p>
        <p>{description}</p>
        {children}
    </div>;
};
