import { ListFiles, Upload } from "./";


/**
 * 
 * @returns A JSX Component that acts as a body of the website for now.
 */
export const Body = () => {
    return <div className="w-full h-full flex justify-center row-start-2 row-span-full overflow-y-scroll">
        <div className="sm:w-[70%] w-full ">
            <Upload />
            <ListFiles />
        </div>
    </div>;
};
