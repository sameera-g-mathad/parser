import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChatWindow, PDFWindow } from "./";

/**
 * 
 * @returns A JSX Component, that displays both pdf and
 * a chat window for the user to ask questions.
 */
export const Chat: React.FC = () => {
    const [pdfUrl, setPdfUrl] = useState('')
    const location = useLocation()

    /**
     * Get the pdf url from s3 bucket with a
     * request to backend.
     */
    const getPdfUrl = async () => {
        const response = await fetch(`/api${location.pathname}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json();
        setPdfUrl(data.url)
    }
    useEffect(() => { getPdfUrl() }, []);


    return <div className="w-full h-screen flex justify-between">
        <div className="w-full flex justify-center "><ChatWindow className="w-[90%]" /></div>
        <div className="sm:w-full">
            <PDFWindow />
        </div>
    </div>;
};
