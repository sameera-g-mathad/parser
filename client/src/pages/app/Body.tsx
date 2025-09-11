import { Upload } from "./Upload";


/**
 * 
 * @returns A JSX Component that acts as a body of the website for now.
 */
export const Body = () => {
    return <div className="w-full h-full flex flex-col sm:px-32 row-start-2 row-span-full">
        <Upload />
        <div className="h-full bg-amber-500">
            Files
        </div>
    </div>;
};
