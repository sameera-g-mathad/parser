import React, { type PropsWithChildren } from "react";
import type { inputGroupInterface } from "./interface";

/**
 * 
 * @param children Any input element that needs to be wrapped by this component.
 * @param classname Tailwind classes in the string format.
 * @param label A string label to display along with the Input Component.
 * @returns A JSX component meant to wrap the Input Component adding labels and additional styling.
 */
export const InputGroup: React.FC<PropsWithChildren & inputGroupInterface> = ({ children, className, label }) => {
    return <div className={`flex flex-col items-start m-2 ${className}`}>
        <label className="capitalize font-semibold">{label}</label>
        {children}
    </div>;
};
