import React, { type PropsWithChildren } from "react";
import type { buttonInterface } from "./interface";

/**
 * 
 * @param callback Function to be called when the button is clicked.
 * @param children Any html elements that needs to be wrapped by the button component.
 * @param className Tailwind classes in the string format.
 * @returns A JSX Button component that is reused in the parser application.
 */
export const Button: React.FC<PropsWithChildren & buttonInterface> = ({ callback, children, className }) => {
    return <button onClick={callback} className={`${className}`}>
        {children}
    </button>
};
