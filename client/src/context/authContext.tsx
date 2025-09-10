import { createContext, type PropsWithChildren, useContext, useState } from "react";

/**
 * Interface for the auth context.
 * A status that is boolean and two
 * functions either login/logout are present.
 */
export interface authContextInterface {
    status: boolean;
    login: () => void;
    logout: () => void;
}

// context creation
const AuthContext = createContext<authContextInterface>({
    status: false,
    login: () => false,
    logout: () => false,
});


/**
 * 
 * @param children Children to be passed for context to work. 
 * @returns A JSX element wrapped around a provider.
 */
export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {

    // status is boolean, to avoid user or others from getting 
    // access to jwt.
    const [status, setStatus] = useState<boolean>(false);

    /**
     * Set the status to true
     * @returns void
     */
    const login = () => setStatus(true);

    /**
     * Set the status to false.
     * @returns void
     */
    const logout = () => setStatus(false);

    return <AuthContext.Provider value={{ status, login, logout }}>
        {children}
    </AuthContext.Provider>
}

// A callback that can be easily used without having
// to import useContext and AuthContext in every file.
export const useAuth = () => useContext(AuthContext)