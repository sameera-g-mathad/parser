import React, { useEffect, useState } from "react";
import { PdfSvg } from "@/svgs";
import { Link } from "react-router-dom";
import type { uploadRowInterface } from "@/interface";

/**
 * 
 * @returns A JSX component that is used to display each upload
 * on the screen
 */
export const ListFiles = () => {
    const [data, setData] = useState<uploadRowInterface[]>([])

    // get all the uploads from the backend.
    const getUploads = async () => {
        const response = await fetch('/api/app/get-uploads',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            }
        )
        const data = await response.json()
        setData(data.uploads)
    }
    useEffect(() => {
        getUploads()
    }, [])

    return <>
        {
            data.map((el, i) =>
                <Link to={`/app/uploads/${el.id}`} key={i}>
                    <ListRow original_name={el.original_name} status={el.status} updated_at={el.updated_at} created_at={el.created_at} />
                </Link>
            )
        }
    </>
};


/**
 * 
 * @param original_name Name of the file to display 
 * @returns A JSX Component with the details of each uplaod. As of
 * now only name is displayed.
 */
const ListRow: React.FC<uploadRowInterface> = ({ original_name }) => {
    return <div className="flex justify-between items-center border border-slate-300 bg-white rounded-xl my-2 p-2 px-5 group overflow-hidden cursor-pointer">
        <div className="flex flex-col">
            <span className="w-64 capitalize font-semibold ellipses">{original_name}</span>
            {/* <span className="flex items-center gap-1 text-xs mt-2">
                <span>
                    <span className={`p-1 px-3 border font-semibold rounded-lg ${status === 'active' ? 'text-green-600 border-green-600 bg-green-100' : 'text-slate-700'}`}>{status}</span>
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                <span>{new Date(updated_at).toDateString()}</span>
            </span> */}
        </div>
        <span className="w-16 h-16  transform transition-transform translate-y-6 rotate-[15deg] group-hover:rotate-0 group-hover:translate-y-0 ">
            <PdfSvg />
        </span>
    </div>
}
