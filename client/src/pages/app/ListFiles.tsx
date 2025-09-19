import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { uploadRowInterface } from "@/interface";
import { Button, Input } from "@/reusables";
import { PdfSvg, SearchSvg, RefreshSvg } from "@/svgs";

/**
 * 
 * @returns A JSX component that is used to display each upload
 * on the screen
 */
export const ListFiles = () => {
    const [data, setData] = useState<uploadRowInterface[]>([])
    const [search, setSearch] = useState<string>('');
    let reqUrl = '/api/app/get-uploads'

    // get all the uploads from the backend.
    const getUploads = async (url: string = reqUrl) => {
        const response = await fetch(url,
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
        let url = reqUrl;
        if (search !== '')
            url += `?search=${encodeURIComponent(search)}`
        getUploads(url)
    }, [search])

    return <div className="flex flex-col ">
        <div className="flex">
            <div className="flex flex-1 border-2 border-slate-300 rounded-xl p-2 my-2">
                <SearchSvg className="w-7 h-7 fill-white! stroke-slate-400" />
                <Input type='text' value={search} callback={(value: string) => setSearch(value)} placeholder="Search your uploads!" className="outline-none flex-1 pl-3 placeholder:text-[15px]" />
            </div>
            <Button callback={getUploads} className="flex border rounded-xl my-2 ml-2 items-center justify-between capitalize p-2 cursor-pointer group">
                <RefreshSvg className="w-5 h-5 stroke-slate-300 mr-2 group-hover:-rotate-360 transform transition-transform duration-500" />
                refresh
            </Button>
        </div>
        {
            data.map((el, i) =>
                el.status === 'active'
                    ?
                    <Link to={`/app/uploads/${el.id}`} key={data.length - i}>
                        <ListRow rowNum={i} original_name={el.original_name} status={el.status} updated_at={el.updated_at} created_at={el.created_at} />
                    </Link>
                    : <div className="cursor-not-allowed" key={data.length - i}>
                        <ListRow rowNum={i} original_name={el.original_name} status={el.status} updated_at={el.updated_at} created_at={el.created_at} />
                    </div>
            )
        }
    </div>
};


/**
 * 
 * @param original_name Name of the file to display 
 * @returns A JSX Component with the details of each uplaod. As of
 * now only name is displayed.
 */
const ListRow: React.FC<uploadRowInterface> = ({ original_name, updated_at, status, rowNum }) => {
    return <div
        className="pdf-view opacity-0 flex justify-between items-center border-2 border-slate-300 bg-white rounded-xl my-2 p-2 px-5 group overflow-hidden cursor-pointer"
        style={{ animationDelay: `${rowNum! * 0.1}s` }}
    >
        <div className="flex flex-col">
            <span className="w-64 capitalize font-semibold ellipses">{original_name}</span>
            <span className="flex items-center gap-1 text-xs mt-2">
                <span>
                    <span className={`p-1 px-3 border font-semibold rounded-lg ${status === 'active' ? 'text-green-600 border-green-600 bg-green-100' : 'text-slate-700 border-slate-600 bg-slate-100'}`}>{status}</span>
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                <span>{new Date(updated_at).toDateString()}</span>
            </span>
        </div>
        <span className="w-16 h-16  transform transition-transform translate-y-6 rotate-[15deg] group-hover:rotate-0 group-hover:translate-y-0 ">
            <PdfSvg />
        </span>
    </div>
}
