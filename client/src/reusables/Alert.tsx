import React from "react";
import type { alertInterface } from "./interface";

export const Alert: React.FC<alertInterface> = ({ className, message }) => {
    return <div className={`alert border px-8 absolute z-10 top-3 left-1/2 transform -translate-x-1/2  p-2 rounded-lg ${className}`}>{message}</div>;
};
