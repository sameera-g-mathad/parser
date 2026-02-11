import { useEffect, useRef, useState } from "react"
import { useAuth } from "@/context/authContext"
import { LogoSvg } from "@/svgs"
import { Alert, Button } from "@/reusables"

/**
 * 
 * @returns A JSX component that displays the logo and the user menu.
 */
export const Header = () => {
    const { user, logout, deleteAccount } = useAuth()
    const { firstName, lastName, email } = user
    const [isOpen, setIsOpen] = useState(false)
    const avatarRef = useRef<HTMLSpanElement>(null);
    const dropDownRef = useRef<HTMLDivElement>(null);

    // This is to add and remove event listner mousedown.
    useEffect(() => {
        // This method is called when mouse is clicked.
        const handleClickOutsideContainer = (e: Event) => {
            // This tells if the mouse was clicked and check if it was clicked outside of the avartar btn.
            // If so hide the dropdown
            if (avatarRef.current &&
                dropDownRef.current &&
                e.target instanceof Node &&
                !avatarRef.current.contains(e.target) &&
                !dropDownRef.current.contains(e.target)
            ) {
                setIsOpen(false)
            }
        }
        // Adding the actual handler.
        document.addEventListener('mousedown', handleClickOutsideContainer)

        // This is called by react automatically during cleanup and unmount.
        return () => document.removeEventListener('mousedown', handleClickOutsideContainer)
    }, [])

    return <div className="flex justify-between sm:px-8 px-2 items-center row-span-1">
        {/* This displays the logo on the left side */}
        <div className="flex justify-center gap-3 items-center">
            <LogoSvg className="w-8 h-8" />
            <span className="text-[20px]">Parser</span>
        </div>
        {/* This displays the user menu on the right side */}
        <div className="relative">
            <span ref={avatarRef} onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 flex justify-center items-center rounded-full hover:bg-emerald-300 bg-emerald-100 text-emerald-700 transition-colors duration-200 uppercase font-semibold cursor-pointer relative"
            >{firstName[0]}{lastName[0]}
            </span>
            {
                // if the avatar is clicked the isOpen is true and will display the dropdown
                isOpen &&
                <div ref={dropDownRef} className="rounded-lg shadow-lg w-90 absolute top-11 right-0 p-5 bg-white border border-slate-200 z-10">
                    <p className="capitalize flex font-medium py-1 text-[15px] ellipses">{firstName + ' ' + lastName}</p>
                    <p className="text-[12px] text-slate-500 ellipses mb-4">{email}</p>
                    <hr />

                    {/*Logout button */}
                    <Button callback={logout} className="py-2 w-full my-4 bg-rose-200 text-rose-700 font-semibold rounded-lg cursor-pointer">Logout</Button>

                    {/* Delete Account */}
                    <div>
                        <span className="text-xs">This is a demo application. Deleting your account will permanently remove your account, uploads, and conversations.</span>
                        <Button callback={deleteAccount} className="py-2 w-full my-4 bg-rose-200 text-rose-700 font-semibold rounded-lg cursor-pointer">Delete Account</Button>
                    </div>
                </div>
            }
        </div>
    </div >
}