import { type PropsWithChildren } from "react";
import type { fileInterface } from "./interface";

/**
 *
 * @param children Children to pass into the FileUpload, any svgs or text 
 * @param className Tailwind properties in the string format.
 * @note - Won't upload the same file consequtive times.
 * @returns A JSX Component that is useful for uploading files.
 */
export const FileUpload: React.FC<PropsWithChildren & fileInterface> = ({ children, className, accept, callback }) => {
    return <div>
        <label className={className} htmlFor="upload">
            {children}
        </label>
        <input onChange={(e) => {
            // check if the files are present.
            // i.e the event returns null aswell.
            let fileList = e.target.files;
            if (fileList)
                callback(fileList)
        }} id='upload' className="hidden" type="file" accept={accept} />
    </div>;
};
