import type React from "react";
import { useCustomReducer, useErrorHandler } from "@/hooks";
import { FileUpload, Alert } from "@/reusables";
import { AddSvg } from "@/svgs";


/**
 * 
 * @returns A JSX component that is used in the dashboard page to
 * allow users to upload files.
 */
export const Upload: React.FC = () => {
    const { state, setAlertMsg } = useCustomReducer({});
    const { withErrorHandler } = useErrorHandler()
    const uploadFile = withErrorHandler(async (files: FileList) => {
        // This ensures multiple files 
        // are not uploaded.
        if (files.length > 1)
            return;
        const file = files[0];
        const formData = new FormData()
        formData.append('file', file)
        const response = await fetch('/api/app/upload', {
            method: 'POST',
            body: formData
        }
        )
        return response
    }, setAlertMsg)
    return <div className="w-full my-4 py-4 rounded-xl flex justify-between items-center sm:px-0 px-2">
        <span className="sm:text-xl font-semibold">
            Begin your journey with Parser
        </span>
        <FileUpload accept=".pdf" callback={(files) => uploadFile(files)}>
            <div className=" bg-indigo-500 flex justify-center items-center gap-2 p-2 text-white rounded-lg cursor-pointer group btn-click">
                <AddSvg className="w-5 h-5 stroke-white transform transition-transform group-hover:rotate-90" />
                <span className="font-bold capitalize">upload document</span>
            </div>

        </FileUpload>
        {/*Overiding style here. */}
        {state.alertMsg['status'] && <Alert className="alert-info" message={state.alertMsg['message']} key={state.alertMsg['id']} />}
    </div>
};

