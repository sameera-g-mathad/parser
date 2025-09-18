import React, { useEffect, useRef, useState } from "react";
import { GlobalWorkerOptions, getDocument, type PDFDocumentLoadingTask, type PDFDocumentProxy, type PDFPageProxy } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import type { pdfWindowInterface } from "@/interface";
import { Button } from "@/reusables";
import { NextSvg } from "@/svgs";

// needed as a worker for pdfjs to run process in the
// background.
GlobalWorkerOptions.workerSrc = pdfWorker

/**
 * 
 * @param url url to fetch the pdf from
 * @param moveToPage Page number and content to be displayed when the 
 * component renders.
 * @returns A JSX Component to view the pdf on the screen.
 */
export const PDFWindow: React.FC<pdfWindowInterface> = ({ url, moveToPage }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // Pdf document.
    const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
    // Current Page being rendered.
    const [currentPage, setCurrentPage] = useState<number>(moveToPage);
    // Total number of pages the pdf has.
    const [totalPages, setTotalPages] = useState<number>(0);

    /**
     * Method to load the pdf using pdfjs-dist.getDocument()
     * @param url url to load the pdf.
     * @returns Promise<void>
     */
    const loadPdf = async (url: string) => {
        if (!url) return;

        // get the whole document.
        const pdfPromise: PDFDocumentLoadingTask = getDocument(
            {
                url,
                disableStream: false, // for faster loading maybe?
                disableAutoFetch: false
            }
        );
        const pdfDoc: PDFDocumentProxy = await pdfPromise.promise

        setPdfDoc(pdfDoc);
        setTotalPages(pdfDoc.numPages)
    }

    /**
     * This method is used to render the current page of the 
     * document onto the screen using canvas api.
     * @returns Promise<void>
     */
    const renderPage = async () => {
        if (!pdfDoc) return;
        // get the current page.
        const page: PDFPageProxy = await pdfDoc.getPage(currentPage);
        // scale: sets how sharp the page should look.
        const viewport = page.getViewport({ scale: 3 })

        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // render the page.
        await page.render({ canvasContext: ctx, viewport, canvas }).promise
    }

    /**
     * Method to increament the page number
     */
    const incrementPage = () => {
        // requested page should be within the range.
        if (currentPage + 1 <= totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    /**
    * Method to decrement the page number
    */
    const decrementPage = () => {
        // requested page should be within the range.
        if (currentPage - 1 >= 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    // load pdf on url change..
    useEffect(() => {
        loadPdf(url)
    }, [url])

    // render page if pdfdoc or current page changes.
    useEffect(() => {
        if (!pdfDoc) return;
        renderPage()
    }, [pdfDoc, currentPage])

    return <div className="w-full h-full p-2">
        {pdfDoc ? <><div className="flex justify-end py-1 gap-3">
            <Button callback={decrementPage}><NextSvg className="rotate-180 btn-click" /></Button>
            <span className="font-semibold text-[14px] flex gap-2">
                <span>{currentPage}</span>
                <span>/</span>
                <span>{totalPages}</span>
            </span>
            <Button callback={incrementPage}><NextSvg className="btn-click" /></Button>
        </div>
            <canvas ref={canvasRef} id='pdf-viewer' className="w-full h-[95%] flex-1" />
        </> : "Loading"}
    </div>
};


PDFWindow.displayName = 'PDFWindow'