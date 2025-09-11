import { useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useCustomReducer, useErrorHandler } from "@/hooks";
import { Alert } from "@/reusables";

/**
 * 
 * @returns A JSX element that verifies the users that click on the
 * verification link sent via email.
 */
export const VerifySignup = () => {
    // location is needed to send the token present
    // in the url
    const location = useLocation();
    const navigate = useNavigate()
    const { withErrorHandler } = useErrorHandler();
    const { state, setAlertMsg } = useCustomReducer({ messge: '' })

    // To redirect users on successful verification
    const onSuccess = () => setTimeout(() => navigate('/auth/sign-in'), 3000)

    // To redirect users on error in verification or the link becomes or is invalid
    const onError = () => setTimeout(() => navigate('/not-found'), 3000)

    // Make a Get request to verify and create user.
    const verifyUser = withErrorHandler(async () => {
        const response = await fetch(`/api${location.pathname}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        return response
    }, setAlertMsg, onSuccess, onError)

    // Call verification on componentDidMount.
    useEffect(() => {
        verifyUser()
    }, [])


    return <div>
        {
            state.alertMsg['status'] &&
            <Alert className={state.alertMsg['type']} key={state.alertMsg['id']} message={state.alertMsg['message']} />
        }
        <span className="flex justify-center m-2">
            <span>Back to &nbsp;</span><Link className="text-blue-700" to="/auth/sign-in">Sign In</Link>
        </span>
    </div>;
};
