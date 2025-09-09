import React, { useEffect } from "react";
import { Alert, Button, Input, InputGroup } from "../../reusables";
import { useAuthReducer, useValidation } from "./hooks";
import { useLocation, useNavigate } from "react-router-dom";

export const ResetPassword = () => {
    const { state, setAlertMsg, setFieldWithValue } = useAuthReducer({ password: '', confirmPassword: '' })
    const location = useLocation();
    const navigate = useNavigate();
    const { isPasswordSame, isPasswordValid } = useValidation();

    const checkIsUrlValid = async () => {
        try {
            const isValidURL = await fetch(`/api${location.pathname}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const url_response = await isValidURL.json();
            console.log(url_response)
            if (url_response.status === 'failure')
                throw Error(url_response.message)

        }
        catch (error: unknown) {
            let message = (error as Error).message || 'Something went wrong, Try again later.'
            setAlertMsg({ type: 'alert-danger', message, status: true, id: Date.now() })
            setTimeout(() => navigate('/not-found'), 3000)
        }
    }
    useEffect(() => {
        checkIsUrlValid()
    }, [])

    const resetPassword = async () => {
        try {
            const { password, confirmPassword } = state;
            if (!password || !confirmPassword) {
                return setAlertMsg({ type: 'alert-danger', message: 'Please complete all required fields.', status: true, id: Date.now() })
            }
            if (!isPasswordValid(password)) {
                return setAlertMsg({ type: 'alert-danger', message: 'Password must have atleast one Uppercase, Lowercase and a number and and in range[15, 30] characters', status: true, id: Date.now() })
            }
            if (!isPasswordSame(password, confirmPassword)) {
                return setAlertMsg({ type: 'alert-danger', message: 'Your passwords don’t match. Please try again.', status: true, id: Date.now() })
            }

            const response = await fetch(`/api${location.pathname}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password, confirmPassword })
            })
            const data = await response.json()
            if (data.status === 'success') {
                return setAlertMsg({ type: 'alert-success', message: data.message, status: true, id: Date.now() })
            }
            else {
                throw Error(data.message)
            }
        }
        catch (error: unknown) {
            let message = (error as Error).message || 'Something went wrong, Try again later.'
            return setAlertMsg({ type: 'alert-danger', message, status: true, id: Date.now() })

        }
    }
    return <div>
        {state.alertMsg['status'] && <Alert className={state.alertMsg.type} key={state.alertMsg.id} message={state.alertMsg.message} />}
        <InputGroup className="py-2" label="new password">
            <Input callback={(password) => setFieldWithValue('password', password)} className="auth-input w-80!" type="password" placeholder="At least 15 length" value={state.password} />
        </InputGroup>
        <InputGroup className="py-2" label="confirm password">
            <Input callback={(confirmPassword) => setFieldWithValue('confirmPassword', confirmPassword)} className="auth-input w-80!" type="password" placeholder="At least 15 length" value={state.confirmPassword} />
        </InputGroup>
        <span className="flex m-2 mt-4">
            <Button callback={resetPassword} className="auth-btn">
                <span>Submit</span>
            </Button>
        </span></div>;
};
