import { type PropsWithChildren } from "react";
import type { className } from "@/interface";

export interface fileInterface {
    accept: string,
    callback: () => void;
}

/**
 * 
 * @param children Children to pass into the FileUpload, any svgs or text 
 * @param className Tailwind properties in the string format.
 * @returns A JSX Component that is useful for uploading files.
 */
export const FileUpload: React.FC<PropsWithChildren & className> = ({ children, className }) => {
    return <div>
        <label className={className} htmlFor="upload">
            {children}
        </label>
        <input id='upload' className="hidden" type="file" accept=".pdf" />
    </div>;
};
