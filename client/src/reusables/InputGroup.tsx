import React, { type PropsWithChildren } from "react";
import type { inputGroupInterface } from "./interface";

export const InputGroup: React.FC<PropsWithChildren & inputGroupInterface> = ({ children, className, label }) => {
    return <div className={`flex flex-col items-start m-2 ${className}`}>
        <label className="capitalize font-semibold">{label}</label>
        {children}
    </div>;
};
