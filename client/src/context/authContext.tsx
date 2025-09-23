import { createContext, type PropsWithChildren, useContext, useEffect, useState } from "react";


export type user = {
    firstName: string,
    lastName: string,
    email: string,
    id: string
}
/**
 * Interface for the auth context.
 * A status that is boolean and two
 * functions either login/logout are present.
 */
export interface authContextInterface {
    status: boolean;
    user: {
        firstName: string,
        lastName: string,
        email: string,
        id: string
    }
    login: () => void;
    logout: () => void;
}

// context creation
const AuthContext = createContext<authContextInterface>({
    status: false,
    user: {
        firstName: '',
        lastName: '',
        email: '',
        id: '',
    },
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
    const [user, setUser] = useState<user>({ firstName: '', lastName: '', email: '', id: '' })
    const [loading, setLoading] = useState<boolean>(true);


    // A GET method call to check whether the user
    // is logged in or not.
    const getStatus = async () => {
        try {
            const response = await fetch('/api/app/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()
            // If the server responds with a successful response
            // or no change in its response, then the status is true.
            if (response.status === 200 || response.status === 304) {
                setUser({
                    ...data.user
                })
                setStatus(true)
            }
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
    const login = () => {
        getStatus()
    }

    /**
     * Set the status to false.
     * Makes a GET method to server to clear
     * the cookie that is set.
     * @returns void
     */
    const logout = async () => {
        try {
            await fetch('/api/auth/sign-out',
                {
                    'method': 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
        }
        catch (e) {
            console.log(e)
        }
        finally {
            // finally set the status to false
            setStatus(false)
            setLoading(false)
        }
    }
    if (loading)
        return null
    return <AuthContext.Provider value={{ status, user, login, logout }}>
        {/* 
            Make sure to have loading to true so that the page
            doesn't reroutes to any route before getting the login
            status.
        */}
        {children}
    </AuthContext.Provider>
}

// A callback that can be easily used without having
// to import useContext and AuthContext in every file.
export const useAuth = () => useContext(AuthContext)