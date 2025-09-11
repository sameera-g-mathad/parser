import { FileUpload } from "@/reusables";

/**
 * 
 * @returns A JSX component that is used in the dashboard page to
 * allow users to upload files.
 */
export const Upload = () => {

    const uploadFile = async (files: FileList) => {
        try {
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
        }
        catch (error) {
            console.log(error)
        }
    }
    return <div className="w-full h-32 flex justify-between items-center sm:px-0 px-2 ">
        <span className="sm:text-xl font-semibold">
            Begin your journey with Parser
        </span>
        <FileUpload accept=".pdf" callback={(files) => uploadFile(files)}>
            <span className="bg-indigo-500 p-2 text-white rounded-full cursor-pointer">File Upload</span>
        </FileUpload>
    </div>
};
