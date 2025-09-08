import { useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuthReducer } from "./hooks";
import { Alert } from "../../reusables";

export const VerifySignup = () => {
    const location = useLocation();
    const navigate = useNavigate()
    const { state, setAlertMsg } = useAuthReducer({ messge: '' })

    const verifyUser = async () => {
        try {
            const response = await fetch(`/api${location.pathname}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            const data = await response.json()
            if (data.status === 'success') {
                setAlertMsg({ type: 'alert-success', status: true, message: data.message, id: Date.now() })
                setTimeout(() => navigate('/auth/sign-in'), 4000)
            }
            else throw Error(data.message)
        }
        catch (error: unknown) {
            let message = (error as Error).message || 'Something went wrong, Try again later.'
            return setAlertMsg({ type: 'alert-danger', message, status: true, id: Date.now() })
        }
    }

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
