import { Body, Header } from "./";
/**
 * @returns A JSX element that the user sees after succesful login.
 */
export const Dashboard = () => {
    return <div className="w-screen h-screen grid grid-rows-15 bg-slate-00">
        <Header />
        <Body />
    </div>;
};

