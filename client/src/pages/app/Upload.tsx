import React, { useEffect } from "react";
import { useCustomReducer, useErrorHandler } from "@/hooks";
import { FileUpload, Alert } from "@/reusables";
import { ActiveSvg, AddSvg, PdfSvg, ProcessingSvg } from "@/svgs";
import { useAuth } from "@/context/authContext";
import { DocumentCard } from './'

/**
 * 
 * @returns A JSX component that is used in the dashboard page to
 * allow users to upload files.
 */
export const Upload: React.FC = () => {
    const { state, setAlertMsg, setFieldWithValue } = useCustomReducer({ total: 0, active: 0, processing: 0 });
    const { withErrorHandler } = useErrorHandler()
    const { user } = useAuth();
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

    /**
     * Method to get the stats to display in the dashboard,
     * i.e how many total uploads does the user have, how many 
     * of them are active and how many of them are under processing.
     */
    const getUploadDetails = withErrorHandler(async () => {
        const response = await fetch(`/api/app/upload/${user.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const clone = response.clone()
        const data = await response.json();
        setFieldWithValue('total', parseInt(data.stats.count))
        setFieldWithValue('active', data.stats.active)
        setFieldWithValue('processing', data.stats.processing)
        return clone;

    })

    // get it when the component starts.
    useEffect(() => {
        getUploadDetails()
    }, [])

    return <div className="w-full py-4 rounded-xl sm:px-0 px-2">
        <div className="flex justify-between items-center">
            <div className="flex flex-col gap-2">
                <span className="sm:text-xl ">
                    Start your journey with Parser
                </span>
                <span className="font-[13px]">
                    Turn your PDFs into interactive conversations powered by AI.
                </span>
            </div>
            <FileUpload accept=".pdf" callback={(files) => uploadFile(files)}>
                <div className=" bg-indigo-500 flex justify-center items-center gap-4 p-2 text-white rounded-lg cursor-pointer group btn-click">
                    <AddSvg className="w-5 h-5 stroke-white transform transition-transform group-hover:rotate-90" />
                    <span className="font-semibold capitalize">upload document</span>
                </div>

            </FileUpload>
            {/*Overiding style here. */}
            {state.alertMsg['status'] && <Alert className="alert-info" message={state.alertMsg['message']} key={state.alertMsg['id']} />}
        </div>
        <div className="my-2 mt-4 flex justify-between items-center gap-5">
            <DocumentCard title="total documents" value={state.total} className="border-red-500"><PdfSvg className="w-12 h-12 border p-2 rounded-lg fill-red-500 bg-red-100 border-red-500" /></DocumentCard>
            <DocumentCard title="active documents" value={state.active} className="border-green-500"><ActiveSvg className="w-12 h-12 border p-2 rounded-lg stroke-green-500 bg-green-100 border-green-500" /></DocumentCard>
            <DocumentCard title="processing documents" value={state.processing} className="border-blue-500"><ProcessingSvg className="w-12 h-12 border p-2 rounded-lg fill-blue-500 bg-blue-100 border-blue-500" /></DocumentCard>
        </div>
    </div>
};



