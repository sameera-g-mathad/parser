import React from "react";
import type { alertInterface } from "./interface";

/**
 * 
 * @param className Tailwind classes in the string format.
 * @param message Message to display on the alert component. 
 * @returns A JSX Component to display the alerts on screen.
 */
export const Alert: React.FC<alertInterface> = ({ className, message }) => {
    return <div className={`alert border px-8 absolute z-10 top-3 left-1/2 transform -translate-x-1/2  p-2 rounded-lg ${className}`}>{message}</div>;
};
