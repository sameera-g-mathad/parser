import React from "react";
import type { inputInterface } from "./interface";

export const Input: React.FC<inputInterface> = ({ className, callback, placeholder, type }) => {
    return <input className={` ${className}`} type={type} placeholder={placeholder} onChange={(e) => callback(e.target.value)} />
};
