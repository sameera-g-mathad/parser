import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChatWindow, PDFWindow } from "./";
import { useCustomReducer, useErrorHandler } from "@/hooks";

/**
 * 
 * @returns A JSX Component, that displays both pdf and
 * a chat window for the user to ask questions.
 */
export const Chat: React.FC = () => {
    const { state, setFieldWithValue } = useCustomReducer({ pdfUrl: '', moveToPage: 1 })
    const { withErrorHandler } = useErrorHandler()
    const location = useLocation()
    const navigate = useNavigate()
    // lets say if the user wants to navigate to a upload page
    // that is non-existent.
    const onError = () => navigate('/not-found')

    /**
     * Get the pdf url from s3 bucket with a
     * request to backend.
     */
    const getPdfUrl = withErrorHandler(async () => {
        const response = await fetch(`/api${location.pathname}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        // workaround, ts will throw an error 
        // if the response is read twice.
        // since withErrorHandler will always read
        // the response irrespective of it being read or not,
        // it is better to send a clone of it.
        const clone = response.clone();
        const data = await response.json();
        setFieldWithValue('pdfUrl', data.url)
        return clone
    }, undefined, null, onError)

    useEffect(() => { getPdfUrl() }, []);
    const { pdfUrl, moveToPage } = state;

    return <div className="w-full h-screen flex justify-between">
        <div className="w-full flex justify-center "><ChatWindow className="w-[90%]" onPageClick={(page: number) => setFieldWithValue('moveToPage', page)} /></div>
        <div className="sm:w-full">
            {pdfUrl ? <PDFWindow url={pdfUrl} moveToPage={moveToPage} /> : ''}
        </div>
    </div>;
};
