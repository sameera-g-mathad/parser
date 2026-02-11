import React, { useEffect, useState } from "react";
import { ListRow } from "./";
import type { uploadRowInterface } from "@/interface";
import { Alert, Button, Input } from "@/reusables";
import { SearchSvg, RefreshSvg, MyDocuments, LogoSvg } from "@/svgs";
import { useCustomReducer, useErrorHandler } from "@/hooks";
import type { listFilesInterface } from "@/interface";

/**
 * 
 * @returns A JSX component that is used to display each upload
 * on the screen
 */
export const ListFiles: React.FC<listFilesInterface> = ({ callback }) => {
    const [data, setData] = useState<uploadRowInterface[]>([])
    const [search, setSearch] = useState<string>('');
    const { state, setAlertMsg } = useCustomReducer({});
    const { withErrorHandler } = useErrorHandler()
    let reqUrl = '/api/app/get-uploads'


    // get all the uploads from the backend. url is required.
    const getUploads = withErrorHandler(async (url: string = reqUrl) => {
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
    })

    /**
     * To delete a upload by its id. Invoked by ListRow when user deletes.
     */
    const deleteById = withErrorHandler(async (e: React.MouseEvent, id: string) => {
        // this prevents user from visiting the pdf
        e.stopPropagation();

        // this is to add delete animation to the screen
        setData(prev => prev.map(el => {
            if (el.id === id)
                return { ...el, deleting: true } as uploadRowInterface;
            return el
        }))

        // delete the upload from the database.
        const response = await fetch(`/api/app/uploads/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        // filter the upload from the current uploads.
        setTimeout(() => {
            setData(prev => prev.filter(el => el.id !== id))
        }, 300)


        return response

    }, setAlertMsg)


    useEffect(() => {
        // this is to create a query string to search
        // the db for a particular upload.
        let url = reqUrl;
        if (search !== '')
            url += `?search=${encodeURIComponent(search)}`
        getUploads(url);
    }, [search])

    return <div className="flex flex-col flex-1 px-2 rounded-xl bg-white overflow-hidden">
        <div className="flex justify-between gap-40 py-4">
            <div className="flex gap-3 items-center ">
                <MyDocuments className="w-12 h-12 border p-2 rounded-xl fill-indigo-500 bg-indigo-100 border-indigo-500" />
                <div className="flex flex-col">
                    <span className="capitalize font-semibold">My Documents</span>
                    <span className="first-letter:capitalize">manage and chat with you documents</span>
                </div>
            </div>
            <div className="flex justify-between flex-1">
                <div className="flex flex-1 border border-blue-300 rounded-xl p-1 my-2 group">
                    <SearchSvg className="w-7 h-7 stroke-blue-400 fill-transparent group-hover:scale-90" />
                    <Input type='text' value={search} callback={(value: string) => setSearch(value)} placeholder="Search your uploads!" className="outline-none flex-1 pl-3 placeholder:text-[15px] placeholder-blue-400" />
                </div>
                <Button callback={() => { getUploads(); callback() }} className="flex border border-pink-500 rounded-xl my-2 ml-2 items-center justify-between capitalize p-2 cursor-pointer group btn-click stroke-pink-500 text-pink-500">
                    <RefreshSvg className="w-5 h-5 mr-2 group-hover:-rotate-360 transform transition-transform duration-500" />
                    refresh
                </Button>
            </div>
        </div>
        {
            data.length > 0 ?
                data.map((el, i) =>
                    <ListRow deleting={el.deleting} callback={deleteById} key={el.id} id={el.id} rowNum={i} original_name={el.original_name} status={el.status} updated_at={el.updated_at} created_at={el.created_at} />
                )
                : <div className="w-full h-full flex flex-col justify-center items-center gap-2 text-indigo-600">
                    <LogoSvg className="w-20 h-20" />
                    <span>Upload your file now</span>
                </div>
        }
        {
            state.alertMsg['status'] &&
            <Alert className={state.alertMsg['type']} message={state.alertMsg['message']} />
        }
    </div>
};



