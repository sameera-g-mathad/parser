import React from "react";
import type { inputInterface } from "./interface";

/**
 * 
 * @param classname Tailwind classes in the string format.
 * @param callback Function to be called on change event.
 * @param placeholder A placeholder needed for any input elements.
 * @param type Can be a email, text or password.
 * @returns A JSX Input Element that can be used to enter text.
 */
export const Input: React.FC<inputInterface> = ({ className, callback, placeholder, type }) => {
    return <input className={` ${className}`} type={type} placeholder={placeholder} onChange={(e) => callback(e.target.value)} />
};
