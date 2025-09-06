import React, { type PropsWithChildren } from "react";
import type { buttonInterface } from "./interface";

export const Button: React.FC<PropsWithChildren & buttonInterface> = ({ callback, children, className }) => {
    return <button onClick={callback} className={`${className}`}>
        {children}
    </button>
};
