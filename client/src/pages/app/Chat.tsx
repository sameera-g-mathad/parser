import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * 
 * @returns A JSX Component, that displays both pdf and
 * a chat window for the user to ask questions.
 */
export const Chat = () => {
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
        <div className="w-full bg-blue-400">Chat</div>
        <div className="w-full">
            {pdfUrl !== '' ?
                <iframe
                    src={pdfUrl}
                    className="w-full h-full"
                /> : ''}
        </div>
    </div>;
};
