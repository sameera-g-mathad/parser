import React from "react";
import { Link } from "react-router-dom";
import { LogoSvg } from "../svgs";

/**
 * 
 * @returns Homepage of the parser Application.
 */
export const Home = () => {
    return <div className="w-full h-screen flex justify-center items-center">
        <div className="absolute top-1/2 left-1/2 w-[70%] h-[70%] bg-gradient-to-tr blur-3xl rounded-full from-blue-300 via-pink-300 to-green-300 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="flex flex-col gap-5 justify-center items-center z-10">
            <LogoSvg className="w-32 h-32 fill-purple-800" />
            <p>Parser</p>
            <Link to="/auth/sign-in">Lets GO</Link>
        </div>
    </div>;
};
