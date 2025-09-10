import { createContext, type PropsWithChildren, useContext, useEffect, useState } from "react";

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
    const [loading, setLoading] = useState<boolean>(true);


    // A GET method call to check whether the user
    // is logged in or not.
    const getStatus = async () => {
        try {
            const response = await fetch('/api/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()
            console.log(data)
            // If the server responds with a successful response
            // or no change in its response, then the status is true.
            if (response.status === 200 || response.status === 304)
                setStatus(true)
        }
        catch (err) {
            setStatus(false);
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getStatus()
    }, [])

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
        {/* 
            Make sure to have loading to true so that the page
            doesn't reroutes to any route before getting the login
            status.
        */}
        {!loading && children}
    </AuthContext.Provider>
}

// A callback that can be easily used without having
// to import useContext and AuthContext in every file.
export const useAuth = () => useContext(AuthContext)